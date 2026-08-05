# SentinelX — Deterministic Cybersecurity Agent

SentinelX is an enterprise-grade, rule-based cybersecurity automation platform. Built with a high-performance FastAPI backend and a hardware-accelerated React (GSAP/Lenis) frontend, SentinelX provides zero-hallucination system monitoring and threat response.

## Architecture

- **Frontend**: React + Vite, GSAP, Lenis Smooth Scrolling, Tailwind CSS (Glassmorphism).
- **Backend API**: Python FastAPI, SQLAlchemy.
- **Rule Engine**: JSON-based deterministic pattern matching.
- **System Watchers**: Cross-platform daemons monitoring file systems, networks, and processes.

## Deployment Options

### 1. Docker Compose (Local/Prod)
```bash
docker-compose up --build -d
```
The dashboard will be available at `http://localhost`, and the API at `http://localhost:8000`.

### 2. Kubernetes
Deploy to any K8s cluster:
```bash
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### 3. CI/CD Pipeline
GitHub Actions are configured in `.github/workflows/main.yml`. Upon pushing to `main`, Docker images are automatically built.

## Documentation
- `PRD.md`: Full product requirements and scope.
- `TASKS.md`: Execution roadmap and project status.
- `AGENTIC.md`: Architecture rules and code conventions.
