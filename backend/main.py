import asyncio
import logging
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config.settings import settings
from backend.database.session import engine, Base, async_session
from backend.watchers.file_watcher import FileWatcher
from backend.watchers.system_watcher import SystemWatcher
from backend.watchers.network_watcher import NetworkWatcher
from backend.watchers.usb_watcher import USBWatcher
from backend.rules.engine import RuleEngine
from backend.models.models import Event

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

rule_engine = RuleEngine("rules.json")
watcher_instances = []


async def execute_action(action: str, rule: dict, details: dict):
    logger.info(f"Executing action '{action}' for rule '{rule.get('id', 'unknown')}'")
    if action == "log":
        logger.info(f"Rule {rule.get('event')} triggered: {details}")
    elif action == "notify":
        pass  # Desktop notification stub
    elif action == "email":
        pass  # Email notification stub


async def event_bus(event_type: str, source: str, details: dict):
    logger.info(f"Event Received: {event_type} from {source} - {details}")

    # Determine severity based on event type
    severity = "info"
    if event_type.startswith("HIGH_"):
        severity = "warning"
    elif event_type in ("USB_INSERTED", "USB_REMOVED", "INTERNET_DISCONNECTED"):
        severity = "notice"

    # Store event in DB
    try:
        async with async_session() as session:
            new_event = Event(
                event_type=event_type,
                source=source,
                details=details,
                severity=severity,
            )
            session.add(new_event)
            await session.commit()
    except Exception as e:
        logger.error(f"Failed to persist event: {e}")

    # Process rules
    await rule_engine.evaluate_event(event_type, details, execute_action)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database tables created")

    # Start watchers
    fw = FileWatcher(["/tmp/sentinelx-watch"], event_bus)
    fw.start()
    watcher_instances.append(fw)

    sw = SystemWatcher(event_bus)
    asyncio.create_task(sw.start())
    watcher_instances.append(sw)

    nw = NetworkWatcher(event_bus)
    asyncio.create_task(nw.start())
    watcher_instances.append(nw)

    uw = USBWatcher(event_bus)
    asyncio.create_task(uw.start())
    watcher_instances.append(uw)

    logger.info("SentinelX Platform Started — all watchers active")
    yield

    # Shutdown
    for w in watcher_instances:
        if hasattr(w, "stop"):
            w.stop()
    logger.info("SentinelX Platform Stopped")


app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "SentinelX API Running", "version": settings.VERSION}


@app.get("/api/v1/events")
async def get_events(limit: int = 100, offset: int = 0):
    from sqlalchemy import select, func

    async with async_session() as session:
        # Get total count
        count_result = await session.execute(select(func.count(Event.id)))
        total = count_result.scalar() or 0

        # Get events with pagination
        result = await session.execute(
            select(Event).order_by(Event.timestamp.desc()).offset(offset).limit(limit)
        )
        events = result.scalars().all()

        return {
            "total": total,
            "events": [
                {
                    "id": e.id,
                    "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                    "event_type": e.event_type,
                    "source": e.source,
                    "details": e.details,
                    "severity": e.severity,
                }
                for e in events
            ],
        }


@app.get("/api/v1/stats")
async def get_stats():
    from sqlalchemy import select, func

    async with async_session() as session:
        total_events = (await session.execute(select(func.count(Event.id)))).scalar() or 0

        # Count by severity
        warning_count = (
            await session.execute(
                select(func.count(Event.id)).where(Event.severity == "warning")
            )
        ).scalar() or 0

        # Count unique sources = active watchers
        sources = (
            await session.execute(select(func.count(func.distinct(Event.source))))
        ).scalar() or 0

        return {
            "total_events": total_events,
            "threats_blocked": warning_count,
            "active_watchers": max(sources, len(watcher_instances)),
        }


@app.get("/api/v1/rules")
async def get_rules():
    return {"rules": rule_engine.rules}


@app.post("/api/v1/rules/reload")
async def reload_rules():
    rule_engine.load_rules()
    return {"message": "Rules reloaded", "count": len(rule_engine.rules)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
