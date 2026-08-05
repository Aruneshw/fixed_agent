# Product Requirements Document (PRD)
## SentinelX — Deterministic Cybersecurity Agent

### 1. Product Vision
SentinelX is a lightweight, strictly deterministic cybersecurity automation platform. It monitors system events (files, network, processes) and triggers automated responses based on strict JSON rules, ensuring 100% predictable outcomes without AI/ML hallucinations.

### 2. Core Architecture
- **Watchers**: Background Python daemons (`watchdog`, `psutil`) tracking system telemetry across OSes (Linux/Windows).
- **Rule Engine**: Evaluates incoming telemetry against deterministic rules.
- **Backend API**: Python FastAPI providing high-throughput event logging.
- **Dashboard**: React/Vite frontend with GSAP and Lenis for a 60fps glassmorphic command center.

### 3. Key Features
1. **Real-time Telemetry Dashboard**: Monitor system load, active watchers, and total events.
2. **Event Ledger**: Paginated, filterable interface for raw system events.
3. **Rule Configuration**: UI to monitor and reload JSON-based automation rules.
4. **Automated Interventions**: Built-in actions (Kill process, Block IP, Log).

### 4. Technical Constraints
- No AI/ML components (must be strictly deterministic).
- Must have a lightweight footprint (<50MB RAM per watcher).
- Must support containerized (Docker/K8s) deployment.
