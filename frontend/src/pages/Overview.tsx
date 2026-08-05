import React, { useEffect, useState, useRef } from 'react';
import { Activity, ShieldAlert, Zap, Server, RefreshCw, AlertTriangle, Info, Bell } from 'lucide-react';
import { SkeletonOverview } from '../components/Skeleton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const DEFAULT_API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const getApiUrl = () => localStorage.getItem('sentinelx_api_url') || DEFAULT_API;

interface StatsData {
  total_events: number;
  threats_blocked: number;
  active_watchers: number;
}

interface EventData {
  id: number;
  timestamp: string | null;
  event_type: string;
  source: string;
  details: Record<string, unknown>;
  severity: string;
}

const severityColor: Record<string, string> = {
  warning: 'bg-[rgba(255,204,0,0.85)] text-black',
  notice: 'bg-[rgba(92,114,123,0.85)] text-white',
  info: 'bg-[rgba(31,46,55,0.85)] text-white',
};

const severityIcon: Record<string, React.ReactNode> = {
  warning: <AlertTriangle size={18} strokeWidth={3} />,
  notice: <Bell size={18} strokeWidth={3} />,
  info: <Info size={18} strokeWidth={3} />,
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  delay,
  accentClass,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  delay: number;
  accentClass: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, delay, ease: "back.out(1.2)" }
      );
    }
  }, []);

  const handleHover = () => {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      className="glass-panel rounded-[20px] p-6 flex flex-col justify-between cursor-default"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center geo-circle glass-button ${accentClass}`}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-black/60 mb-1.5">{title}</h3>
        <p className="text-4xl font-extrabold tracking-tighter text-black massive-heading">{value}</p>
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({ total_events: 0, threats_blocked: 0, active_watchers: 0 });
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [statsRes, eventsRes] = await Promise.all([
        fetch(`${getApiUrl()}/api/v1/stats`),
        fetch(`${getApiUrl()}/api/v1/events?limit=6`),
      ]);

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setRecentEvents(data.events || []);
      }
    } catch {
      // Fallback to Demo Mode when backend is unreachable
      setError(`Backend unreachable (${getApiUrl()}) — Running in Demo Mode`);
      
      const storedStats = localStorage.getItem('sentinelx_demo_stats');
      const storedEvents = localStorage.getItem('sentinelx_demo_events');
      
      let newStats;
      if (storedStats) {
        newStats = JSON.parse(storedStats);
        // Increment randomly on each tick
        if (Math.random() > 0.3) {
          newStats.total_events += Math.floor(Math.random() * 5) + 1;
        }
      } else {
        newStats = {
          total_events: Math.floor(Math.random() * 500) + 4000,
          threats_blocked: Math.floor(Math.random() * 100) + 2400,
          active_watchers: 4
        };
      }
      
      let newEvents;
      const now = new Date();
      if (storedEvents) {
        newEvents = JSON.parse(storedEvents);
        // Sometimes add a new event
        if (Math.random() > 0.5) {
          const eventTypes = ['PROCESS_EXITED', 'HIGH_DISK_USAGE', 'NETWORK_SCAN_DETECTED', 'UNAUTHORIZED_ACCESS', 'PROCESS_STARTED'];
          const sources = ['SYSTEMWATCHER', 'FILEWATCHER', 'NETWATCHER'];
          const severities = ['info', 'notice', 'warning'];
          
          const newEvent = {
            id: Date.now(),
            timestamp: now.toISOString(),
            event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            details: {},
            severity: severities[Math.floor(Math.random() * severities.length)]
          };
          newEvents = [newEvent, ...newEvents].slice(0, 6);
        }
      } else {
        newEvents = [
          { id: 1, timestamp: now.toISOString(), event_type: 'PROCESS_EXITED', source: 'SYSTEMWATCHER', details: {}, severity: 'info' },
          { id: 2, timestamp: new Date(now.getTime() - 2000).toISOString(), event_type: 'HIGH_DISK_USAGE', source: 'SYSTEMWATCHER', details: {}, severity: 'warning' },
          { id: 3, timestamp: new Date(now.getTime() - 5000).toISOString(), event_type: 'NETWORK_SCAN_DETECTED', source: 'NETWATCHER', details: {}, severity: 'notice' },
          { id: 4, timestamp: new Date(now.getTime() - 10000).toISOString(), event_type: 'UNAUTHORIZED_ACCESS', source: 'FILEWATCHER', details: {}, severity: 'warning' },
          { id: 5, timestamp: new Date(now.getTime() - 15000).toISOString(), event_type: 'PROCESS_STARTED', source: 'SYSTEMWATCHER', details: {}, severity: 'info' },
        ];
      }
      
      localStorage.setItem('sentinelx_demo_stats', JSON.stringify(newStats));
      localStorage.setItem('sentinelx_demo_events', JSON.stringify(newEvents));
      
      setStats(newStats);
      setRecentEvents(newEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        ".event-row",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [loading, recentEvents.length]);

  const formatTime = (ts: string | null) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <SkeletonOverview />;
  }

  return (
    <div className="space-y-10" ref={containerRef}>
      <header className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-black massive-heading uppercase">
            Overview
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={fetchData}
            className="w-12 h-12 rounded-full glass-panel text-black hover:bg-[rgba(0,0,0,0.85)] hover:text-white transition-colors flex items-center justify-center shadow-sm"
            title="Refresh"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { rotation: 180, duration: 0.5, ease: "power2.out" })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { rotation: 0, duration: 0.5, ease: "power2.out" })}
          >
            <RefreshCw size={20} strokeWidth={2.5} />
          </button>
          <div className="px-5 py-3 bg-[rgba(0,0,0,0.85)] glass-button text-white rounded-full text-xs font-extrabold flex items-center gap-3 tracking-widest uppercase shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f2b968] animate-pulse" />
            System Active
          </div>
        </div>
      </header>

      {error && (
        <div className="p-5 bg-[rgba(255,59,48,0.85)] glass-panel rounded-full text-white text-base font-bold flex items-center gap-3">
          <AlertTriangle size={20} strokeWidth={3} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.total_events.toLocaleString()}
          icon={Activity}
          delay={0.1}
          accentClass="geo-jet"
        />
        <StatCard
          title="Threats Blocked"
          value={stats.threats_blocked}
          icon={ShieldAlert}
          delay={0.2}
          accentClass="geo-red"
        />
        <StatCard
          title="Active Watchers"
          value={stats.active_watchers}
          icon={Zap}
          delay={0.3}
          accentClass="geo-yellow"
        />
        <StatCard
          title="System Load"
          value={`${Math.floor(Math.random() * 30 + 10)}%`}
          icon={Server}
          delay={0.4}
          accentClass="geo-clay"
        />
      </div>

      <div className="glass-panel rounded-[20px] p-6 lg:p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-extrabold tracking-tighter text-black uppercase">Recent Events</h3>
          <span className="text-xs text-black/60 font-bold tracking-widest uppercase">live · 5s</span>
        </div>
        
        <div className="space-y-3">
          {recentEvents.length === 0 && !loading && (
            <p className="text-black/60 text-center py-10 text-base font-bold uppercase tracking-widest">
              No events recorded
            </p>
          )}
          {recentEvents.map((ev) => (
            <div
              key={ev.id}
              className="event-row flex items-center justify-between py-4 px-5 rounded-xl bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.6)] transition-all cursor-default border border-[rgba(255,255,255,0.4)] shadow-sm hover:shadow-md gpu-accelerate"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full glass-button ${
                    severityColor[ev.severity] || 'bg-[rgba(0,0,0,0.85)] text-white'
                  }`}
                >
                  {severityIcon[ev.severity] || <Info size={16} strokeWidth={3} />}
                </div>
                <div>
                  <p className="font-extrabold text-base text-black tracking-tight">
                    {ev.event_type}
                  </p>
                  <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest mt-0.5">{ev.source}</p>
                </div>
              </div>
              <span className="text-xs text-black font-bold tabular-nums pr-4">
                {formatTime(ev.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
