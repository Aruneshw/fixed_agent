import React, { useEffect, useState, useRef } from 'react';
import { Database, Search, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { SkeletonTableRow } from '../components/Skeleton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface EventData {
  id: number;
  timestamp: string | null;
  event_type: string;
  source: string;
  details: Record<string, unknown>;
  severity: string;
}

const severityBadge: Record<string, string> = {
  warning: 'bg-[rgba(255,204,0,0.85)] text-black',
  notice: 'bg-[rgba(92,114,123,0.85)] text-white',
  info: 'bg-[rgba(31,46,55,0.85)] text-white',
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 20;

  const fetchEvents = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/api/v1/events?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setTotal(data.total || 0);
      }
    } catch {
      setError('Could not reach the backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  useEffect(() => {
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [page]);

  const filtered = filter
    ? events.filter(
        (e) =>
          e.event_type.toLowerCase().includes(filter.toLowerCase()) ||
          e.source.toLowerCase().includes(filter.toLowerCase())
      )
    : events;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useGSAP(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        ".event-row",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }
      );
    }
  }, [loading, filtered.length, page]);

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString([], {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-10" ref={containerRef}>
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-black uppercase flex items-center gap-3 massive-heading">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,0,0,0.85)] glass-button flex items-center justify-center shrink-0">
              <Database className="text-white" size={24} strokeWidth={2.5} />
            </div>
            Events
          </h1>
          <p className="text-black/60 mt-3 text-[10px] font-bold uppercase tracking-widest pl-16">
            {total.toLocaleString()} total events captured
          </p>
        </div>
      </header>

      {/* Filters & Search Section */}
      <section className="glass-panel rounded-[20px] p-6 flex flex-col lg:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black/40" size={18} strokeWidth={3} />
          <input
            type="text"
            placeholder="Filter events…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 glass-panel rounded-full text-base font-bold text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all shadow-sm"
          />
        </div>
        <button
          onClick={fetchEvents}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { rotation: 180, duration: 0.5, ease: "power2.out" })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { rotation: 0, duration: 0.5, ease: "power2.out" })}
          className="w-12 h-12 rounded-full glass-panel text-black hover:bg-[rgba(0,0,0,0.85)] hover:text-white transition-colors flex items-center justify-center shadow-sm shrink-0"
        >
          <RefreshCw size={20} strokeWidth={2.5} className={loading ? 'animate-spin' : ''} />
        </button>
      </section>

      {error && (
        <div className="p-6 bg-[rgba(255,59,48,0.85)] glass-panel rounded-full text-white text-lg font-bold flex items-center gap-4">
          <AlertTriangle size={24} strokeWidth={3} />
          {error}
        </div>
      )}

      <section className="glass-panel rounded-[20px] p-6 lg:p-7 min-h-[500px] flex flex-col">
        {/* Header Row */}
        <div className="grid grid-cols-[60px_1fr_120px_100px_120px] gap-4 px-6 py-3 text-[10px] font-extrabold text-black/50 uppercase tracking-widest border-b-2 border-[rgba(255,255,255,0.4)] mb-4">
          <span>ID</span>
          <span>Event</span>
          <span>Source</span>
          <span>Severity</span>
          <span>Time</span>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4">
          {loading && (
            <div className="space-y-4 pt-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonTableRow key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-6 py-20 text-center text-black/60 text-lg font-bold uppercase tracking-widest">
              {filter ? 'No matches' : 'No events recorded'}
            </div>
          )}
          
          {!loading &&
            filtered.map((ev) => (
              <div
                key={ev.id}
                className="event-row grid grid-cols-[60px_1fr_120px_100px_120px] gap-4 px-5 py-5 items-center rounded-xl bg-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.4)] shadow-sm hover:shadow-md transition-all cursor-default group gpu-accelerate"
              >
                <span className="text-black/50 font-bold text-xs">#{ev.id}</span>
                <div className="min-w-0 pr-3">
                  <p className="text-black font-extrabold text-base tracking-tight truncate">
                    {ev.event_type}
                  </p>
                  {ev.details && Object.keys(ev.details).length > 0 && (
                    <p className="text-[10px] text-black/60 font-bold truncate mt-0.5">
                      {JSON.stringify(ev.details)}
                    </p>
                  )}
                </div>
                <span className="text-black/60 font-bold text-xs uppercase tracking-wider truncate">{ev.source}</span>
                <span>
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase glass-button ${
                      severityBadge[ev.severity] || severityBadge.info
                    }`}
                  >
                    {ev.severity}
                  </span>
                </span>
                <span className="text-black/60 text-xs font-bold tabular-nums">
                  {formatTimestamp(ev.timestamp)}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-14 h-14 rounded-full glass-panel text-black hover:bg-[rgba(0,0,0,0.85)] hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-[rgba(255,255,255,0.4)] disabled:hover:text-black flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <span className="text-lg text-black font-extrabold tracking-widest px-4 glass-panel py-3 rounded-full border border-white/40">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="w-14 h-14 rounded-full glass-panel text-black hover:bg-[rgba(0,0,0,0.85)] hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-[rgba(255,255,255,0.4)] disabled:hover:text-black flex items-center justify-center shadow-sm"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
