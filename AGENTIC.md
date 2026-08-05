# SentinelX — Agentic Development Standards

This document establishes the strict coding guidelines for maintaining SentinelX's performance and design language.

## Frontend Guidelines
1. **Glassmorphism Consistency**: Never deviate from `.glass-panel` and `.glass-button`. Do not use flat opaque backgrounds for containers.
2. **GSAP + Hardware Acceleration**: 
   - Never use `transition-all` on GSAP-animated elements. Use `transition-colors` instead.
   - Always apply the `.gpu-accelerate` class to elements with complex stagger animations (e.g., event rows).
   - Lenis smooth scrolling must remain active and tied to the GSAP ticker.

## Backend Guidelines
1. **No AI/ML**: SentinelX relies purely on strict deterministic rules to avoid false positives. Never introduce LLMs or heuristics to the rule engine.
2. **FastAPI Standards**: Use Pydantic models for all event validation. Ensure all endpoints are completely asynchronous.
3. **Cross-Platform Compatibility**: System watchers must use libraries (`watchdog`, `psutil`) that work seamlessly across Linux and Windows.

## Deployment Guidelines
- All infrastructure must be defined as code (Docker, Kubernetes).
- Do not commit secrets. Use environment variables defined in CI/CD pipelines.
