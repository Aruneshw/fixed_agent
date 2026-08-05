import React, { useEffect, useState, useRef } from 'react';
import { Cpu, RefreshCw, CheckCircle, XCircle, Zap, AlertTriangle } from 'lucide-react';
import { SkeletonRuleCard } from '../components/Skeleton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RuleData {
  id: number;
  event: string;
  conditions: Record<string, unknown>;
  actions: string[];
  enabled?: boolean;
}

const actionColors: Record<string, string> = {
  log: 'bg-[rgba(92,114,123,0.85)] text-white',
  notify: 'bg-[rgba(31,46,55,0.85)] text-white',
  email: 'bg-[rgba(255,204,0,0.85)] text-black',
};

const RuleCard = ({ rule, index }: { rule: RuleData, index: number }) => {
  const isEnabled = rule.conditions?.enabled !== false && rule.enabled !== false;
  const cardRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, delay: index * 0.1, ease: "back.out(1.2)" }
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
      className="glass-panel rounded-[20px] p-6 lg:p-7 flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[rgba(255,255,255,0.6)] glass-button rounded-full flex items-center justify-center shrink-0">
            <Zap size={28} strokeWidth={2.5} className="text-black" />
          </div>
          <div>
            <h3 className="font-extrabold text-2xl text-black tracking-tight uppercase">Rule {rule.id}</h3>
            <p className="text-xs text-black/60 font-bold tracking-widest uppercase mt-1">{rule.event}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase">
          {isEnabled ? (
            <div className="px-4 py-2 bg-[rgba(0,0,0,0.85)] glass-button text-white rounded-full flex items-center gap-2">
              <CheckCircle size={16} strokeWidth={3} />
              Active
            </div>
          ) : (
            <div className="px-4 py-2 bg-[rgba(255,59,48,0.85)] glass-button text-white rounded-full flex items-center gap-2">
              <XCircle size={16} strokeWidth={3} />
              Disabled
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Conditions */}
        <div className="bg-[rgba(255,255,255,0.3)] rounded-[1.5rem] p-5 border border-[rgba(255,255,255,0.4)]">
          <p className="text-[10px] text-black/50 uppercase tracking-widest font-extrabold mb-3">
            Conditions
          </p>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(rule.conditions || {})
              .filter(([k]) => k !== 'enabled')
              .map(([key, val]) => (
                <span
                  key={key}
                  className="px-3 py-1.5 glass-button rounded-full text-xs font-bold text-black border-2 border-transparent"
                >
                  <span className="text-black/50 mr-1.5 uppercase tracking-wide">{key}</span>
                  {String(val)}
                </span>
              ))}
            {Object.keys(rule.conditions || {}).filter((k) => k !== 'enabled').length === 0 && (
              <span className="text-xs text-black/60 font-bold uppercase tracking-widest italic py-1.5">Wildcard (All events)</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div>
          <p className="text-[10px] text-black/50 uppercase tracking-widest font-extrabold mb-3">
            Actions
          </p>
          <div className="flex flex-wrap gap-2.5">
            {rule.actions.map((action) => (
              <span
                key={action}
                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest glass-button ${
                  actionColors[action] || 'bg-[rgba(255,255,255,0.6)] text-black'
                }`}
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Rules: React.FC = () => {
  const [rules, setRules] = useState<RuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/api/v1/rules`);
      if (res.ok) {
        const data = await res.json();
        setRules(data.rules || []);
      }
    } catch {
      setError('Could not reach the backend API');
    } finally {
      setLoading(false);
    }
  };

  const reloadRules = async () => {
    setReloading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/rules/reload`, { method: 'POST' });
      if (res.ok) {
        await fetchRules();
      }
    } catch {
      setError('Reload failed');
    } finally {
      setReloading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-black uppercase flex items-center gap-3 massive-heading">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,0,0,0.85)] glass-button flex items-center justify-center shrink-0">
              <Cpu className="text-white" size={24} strokeWidth={2.5} />
            </div>
            Rules
          </h1>
          <p className="text-black/60 mt-3 text-[10px] font-bold uppercase tracking-widest pl-16">
            {loading ? '…' : `${rules.length} automation ${rules.length === 1 ? 'rule' : 'rules'} loaded`}
          </p>
        </div>

        <button
          onClick={reloadRules}
          disabled={reloading}
          className="flex items-center gap-3 px-6 py-3 glass-panel text-black hover:bg-[rgba(0,0,0,0.85)] hover:text-white rounded-full text-base font-extrabold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50"
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "back.out(1.5)" })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" })}
        >
          <RefreshCw size={20} strokeWidth={3} className={reloading ? 'animate-spin' : ''} />
          Reload
        </button>
      </header>

      {error && (
        <div className="p-6 bg-[rgba(255,59,48,0.85)] glass-panel rounded-full text-white text-lg font-bold flex items-center gap-4">
          <AlertTriangle size={24} strokeWidth={3} />
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SkeletonRuleCard />
          <SkeletonRuleCard />
          <SkeletonRuleCard />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {rules.map((rule, i) => (
            <RuleCard key={rule.id} rule={rule} index={i} />
          ))}
        </div>
      )}

      {!loading && rules.length === 0 && (
        <div className="text-center py-20 text-black/60 text-xl font-bold uppercase tracking-widest">
          No rules configured
        </div>
      )}
    </div>
  );
};

export default Rules;
