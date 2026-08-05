# SentinelX — Execution Roadmap

This document outlines the step-by-step tasks required to build the backend infrastructure, the installable system watchers, and the deterministic rule engine to make SentinelX fully functional.

## Phase 1: Frontend UI & Architecture (✅ Completed)
- [x] Establish Bold Minimalist glassmorphism design tokens in `index.css`.
- [x] Implement GSAP animations for buttery smooth component reveals.
- [x] Integrate `@studio-freight/lenis` and hardware acceleration for premium scrolling.
- [x] Structure enterprise SaaS modular layout across `Overview`, `Events`, and `Rules` pages.

## Phase 2: Core Backend API Setup (⏳ Next)
- [ ] **Initialize FastAPI**: Set up `backend/main.py` with FastAPI and configure CORS for the React frontend.
- [ ] **Database Setup**: Configure SQLite (development) / PostgreSQL (production) using SQLAlchemy or SQLModel to store events and rules persistently.
- [ ] **API Endpoints**: Build out the real endpoints to replace current mock data:
  - `GET /api/v1/stats`
  - `GET /api/v1/events`
  - `GET /api/v1/rules`
  - `POST /api/v1/rules/reload`

## Phase 3: System Watcher Agents (The "Installers")
These are the components that will actually be installed on target systems to monitor activity.
- [ ] **File Watcher (`backend/watchers/file_watcher.py`)**: Use `watchdog` to monitor critical directories (e.g., `/etc/` or `C:\Windows\System32`) for unauthorized file modifications.
- [ ] **Process Watcher (`backend/watchers/process_watcher.py`)**: Use `psutil` to track high CPU/memory usage and identify rogue processes.
- [ ] **Network Watcher (`backend/watchers/network_watcher.py`)**: Monitor active socket connections and detect unauthorized outbound traffic.
- [ ] **Agent Installer Scripts**: Create `.sh` (Linux) and `.ps1` (Windows) scripts to install the watchers as background daemons/services on target machines.

## Phase 4: Deterministic Rule Engine
- [ ] **Engine Logic (`backend/engine/core.py`)**: Write the strict pattern-matching system that compares incoming watcher events against the active JSON rules.
- [ ] **Action Executors**: Implement the scripts that run when a rule is violated:
  - `KillProcessAction`: Automatically terminates a malicious process.
  - `LogAction`: Writes severity to the database.
  - `AlertAction`: Sends an email or webhook notification.

## Phase 5: Containerization & Deployment
- [ ] **Dockerization**: Create `Dockerfile` for the frontend and backend.
- [ ] **Docker Compose**: Create `docker-compose.yml` to spin up the entire platform (Frontend, Backend, Database) with a single command.
- [ ] **Standalone Agent Packaging**: Compile the watcher scripts using `PyInstaller` into standalone executables (`sentinel-agent.exe`, `sentinel-agent`) so they can be easily distributed to target servers without requiring Python to be installed.
