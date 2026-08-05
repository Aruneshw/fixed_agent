import os
import asyncio
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from typing import Callable

logger = logging.getLogger(__name__)


class SentinelFileHandler(FileSystemEventHandler):
    def __init__(self, callback: Callable, loop: asyncio.AbstractEventLoop):
        self.callback = callback
        self.loop = loop

    def on_created(self, event):
        self._dispatch("FILE_CREATED", event)

    def on_deleted(self, event):
        self._dispatch("FILE_DELETED", event)

    def on_modified(self, event):
        self._dispatch("FILE_MODIFIED", event)

    def on_moved(self, event):
        self._dispatch("FILE_MOVED", event)

    def _dispatch(self, event_type: str, event):
        """Schedule the async callback on the running event loop from the watchdog thread."""
        try:
            asyncio.run_coroutine_threadsafe(
                self.callback(event_type, event), self.loop
            )
        except Exception as e:
            logger.error(f"FileWatcher dispatch error: {e}")


class FileWatcher:
    def __init__(self, paths: list[str], event_bus_callback: Callable):
        self.paths = paths
        self.observer = Observer()
        self.event_bus_callback = event_bus_callback

    def handle_event(self, event_type: str, event):
        """Process a watchdog event and forward details to the event bus."""
        details = {
            "path": event.src_path,
            "is_directory": event.is_directory,
        }
        if hasattr(event, "dest_path"):
            details["dest_path"] = event.dest_path

        # Determine size if file
        if not event.is_directory and os.path.exists(event.src_path):
            try:
                details["size"] = os.path.getsize(event.src_path)
                details["extension"] = os.path.splitext(event.src_path)[1]
            except Exception:
                pass

        return self.event_bus_callback(event_type, "FileWatcher", details)

    def start(self):
        loop = asyncio.get_event_loop()
        handler = SentinelFileHandler(self.handle_event, loop)
        for path in self.paths:
            if os.path.exists(path):
                self.observer.schedule(handler, path, recursive=True)
                logger.info(f"FileWatcher monitoring: {path}")
        self.observer.start()

    def stop(self):
        self.observer.stop()
        self.observer.join()
