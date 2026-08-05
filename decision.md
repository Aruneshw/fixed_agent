# Architectural Decisions

## 1. Animation Library: GSAP vs. Framer Motion
- **Decision**: Migrate complex animations to GSAP.
- **Rationale**: While Framer Motion is excellent for basic React state transitions, GSAP offers unparalleled performance and sequencing for complex UI interactions, such as smooth hover states, staggered list reveals, and canvas manipulation. GSAP is the industry standard for creating premium, "awwwards-style" web experiences.

## 2. Rendering the Particle Field
- **Decision**: Use HTML5 `<canvas>` managed by React.
- **Rationale**: Creating hundreds of drifting particles as individual HTML DOM elements (like `<div>`) is extremely taxing on the browser and causes severe lag. Rendering them via a single Canvas element using WebGL/2D context is incredibly lightweight and ensures 60+ FPS even on lower-end machines.

## 3. Glassmorphism Implementation
- **Decision**: Utilize CSS `backdrop-filter: blur()` paired with translucent background colors (e.g., `rgba(255, 255, 255, 0.4)`).
- **Rationale**: This allows the dynamic Particle Field running in the background layer to be visible *through* the UI components, creating a deep, premium 3D layering effect.

## 4. Addressing "SolidJS and Vue.js for the Backend"
- **Decision**: Maintain the current stack (React Frontend + FastAPI Python Backend).
- **Rationale**: There is a common misconception regarding SolidJS and Vue.js. They are **Frontend UI Frameworks** (competitors to React), not backend frameworks. Our backend is written in Python (FastAPI), which is necessary for low-level system watcher scripts (tracking CPU, RAM, Network, and File changes). Rebuilding the frontend in SolidJS or Vue.js would require a complete rewrite of the UI layer for minimal gain, as we can achieve identical blazing-fast performance and smooth animations in our current React setup by leveraging GSAP and Canvas.
