import React, { useRef } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Activity, Shield, Cpu, Database, Settings } from 'lucide-react';
import TypewriterText from './TypewriterText';
import ParticleField from './ParticleField';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Make GSAP tick run Lenis requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Page transition on route change
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [location.pathname]);

  const handleMouseEnter = (index: number) => {
    if (navRefs.current[index]) {
      gsap.to(navRefs.current[index], {
        scale: 1.05,
        duration: 0.3,
        ease: "back.out(1.5)"
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    if (navRefs.current[index]) {
      gsap.to(navRefs.current[index], {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center lg:justify-start gap-4 px-5 py-3.5 rounded-full font-bold text-base tracking-tight glass-button transition-colors duration-300 ${
      isActive
        ? 'bg-[rgba(0,0,0,0.85)] text-white shadow-lg'
        : 'text-black hover:bg-[rgba(0,0,0,0.05)]'
    }`;

  const navItems = [
    { to: "/", icon: Activity, label: "Overview", end: true },
    { to: "/events", icon: Database, label: "Events", end: false },
    { to: "/rules", icon: Cpu, label: "Rule Engine", end: false },
    { to: "/settings", icon: Settings, label: "Settings", end: false },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row text-black relative z-0">
      <ParticleField />
      
      {/* Floating Sidebar */}
      <aside className="lg:w-[320px] p-6 lg:p-8 flex flex-col z-10 sticky top-0 lg:h-screen shrink-0">
        <div className="flex flex-col h-full glass-panel rounded-[2.5rem] p-6">
          {/* Logo area */}
          <div className="pb-8">
            <h1 className="text-2xl massive-heading flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(0,0,0,0.85)] flex items-center justify-center shrink-0 glass-button">
                <Shield className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="tracking-tighter uppercase">SentinelX</span>
            </h1>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] animate-pulse shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/60 leading-tight">
                <TypewriterText
                  phrases={[
                    'Autonomous Protection',
                    'Monitoring Active',
                    'Threat Detection Live',
                    'System Guardian'
                  ]}
                  typingSpeed={55}
                  deletingSpeed={30}
                  pauseDuration={2500}
                  cursorColor="#000000"
                />
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-3 mt-4">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                ref={(el) => { navRefs.current[index] = el; }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className={navLinkClass}
              >
                <item.icon size={22} strokeWidth={2.5} />
                <span className="hidden lg:block text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="mt-auto pt-6 px-1">
            <div className="flex items-center gap-3 p-2 bg-[rgba(255,255,255,0.6)] rounded-full glass-button">
              <div className="w-10 h-10 rounded-full bg-[rgba(242,185,104,0.85)] flex items-center justify-center text-black font-extrabold text-sm">
                SX
              </div>
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-base font-extrabold tracking-tight truncate">Admin</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 p-10 lg:p-12 lg:pl-0" ref={mainRef}>
        <div className="max-w-[1500px] mx-auto w-full h-full min-h-[calc(100vh-6rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
