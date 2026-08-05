import React, { useRef, useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Layout, Network } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Settings: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('sentinelx_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:8000';
    setApiUrl(savedUrl);
  }, []);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".settings-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('sentinelx_api_url', apiUrl);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload(); // Reload to apply new API URL globally
    }, 1000);
  };

  return (
    <div className="space-y-10" ref={containerRef}>
      <header className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-black massive-heading uppercase flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center geo-circle glass-button bg-[rgba(31,46,55,0.85)] text-white">
              <SettingsIcon size={24} strokeWidth={2.5} />
            </div>
            Settings
          </h1>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-3 text-white rounded-full text-xs font-extrabold flex items-center gap-2 tracking-widest uppercase shadow-md transition-all duration-300 ${saved ? 'bg-[#34c759]' : 'bg-[rgba(0,0,0,0.85)] hover:bg-black'}`}
        >
          <Save size={16} strokeWidth={2.5} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Network & API */}
        <div className="settings-card glass-panel rounded-[20px] p-8 cursor-default lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.05)] text-black">
              <Network size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tighter text-black uppercase">Network & API</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block font-bold text-sm text-black mb-2">Backend API URL</label>
              <p className="text-xs text-black/60 font-medium mb-3">Configure the endpoint for the SentinelX Python Backend. If unreachable, the dashboard will fall back to Demo Mode.</p>
              <input 
                type="text" 
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full lg:w-1/2 px-5 py-3 rounded-xl bg-[rgba(255,255,255,0.6)] border-2 border-[rgba(0,0,0,0.1)] focus:border-black focus:outline-none transition-colors text-sm font-bold text-black"
                placeholder="http://localhost:8000"
              />
            </div>
          </div>
        </div>

        {/* Core System */}
        <div className="settings-card glass-panel rounded-[20px] p-8 cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.05)] text-black">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tighter text-black uppercase">Core System</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">Autonomous Defense Mode</p>
                <p className="text-xs text-black/60 font-medium">Automatically block high-severity threats</p>
              </div>
              <div className="w-12 h-6 bg-[rgba(52,199,89,0.2)] rounded-full relative cursor-pointer border border-[rgba(52,199,89,0.5)]">
                <div className="w-4 h-4 bg-[#34c759] rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">Strict Rule Enforcement</p>
                <p className="text-xs text-black/60 font-medium">Require signature match for all unknown processes</p>
              </div>
              <div className="w-12 h-6 bg-[rgba(0,0,0,0.05)] rounded-full relative cursor-pointer border border-[rgba(0,0,0,0.1)]">
                <div className="w-4 h-4 bg-black/40 rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Watcher Configuration */}
        <div className="settings-card glass-panel rounded-[20px] p-8 cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.05)] text-black">
              <Database size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tighter text-black uppercase">Watchers</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.4)] transition-colors">
              <span className="font-bold text-sm text-black">File System Watcher</span>
              <span className="text-xs font-bold px-3 py-1 bg-[rgba(52,199,89,0.1)] text-[#34c759] rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.4)] transition-colors">
              <span className="font-bold text-sm text-black">Network Traffic Monitor</span>
              <span className="text-xs font-bold px-3 py-1 bg-[rgba(52,199,89,0.1)] text-[#34c759] rounded-full uppercase tracking-wider">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.4)] transition-colors">
              <span className="font-bold text-sm text-black">Process Memory Scanner</span>
              <span className="text-xs font-bold px-3 py-1 bg-[rgba(255,204,0,0.2)] text-[#b89300] rounded-full uppercase tracking-wider">Passive</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card glass-panel rounded-[20px] p-8 cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.05)] text-black">
              <Bell size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tighter text-black uppercase">Notifications</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">Email Alerts</p>
                <p className="text-xs text-black/60 font-medium">Send critical alerts to admin email</p>
              </div>
              <div className="w-12 h-6 bg-[rgba(52,199,89,0.2)] rounded-full relative cursor-pointer border border-[rgba(52,199,89,0.5)]">
                <div className="w-4 h-4 bg-[#34c759] rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">System Sounds</p>
                <p className="text-xs text-black/60 font-medium">Play alert sound on threat detection</p>
              </div>
              <div className="w-12 h-6 bg-[rgba(0,0,0,0.05)] rounded-full relative cursor-pointer border border-[rgba(0,0,0,0.1)]">
                <div className="w-4 h-4 bg-black/40 rounded-full absolute top-1 left-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-card glass-panel rounded-[20px] p-8 cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.05)] text-black">
              <Layout size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold tracking-tighter text-black uppercase">Appearance</h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-bold text-sm text-black mb-3">Theme Settings</p>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-[rgba(0,0,0,0.85)] text-white rounded-xl text-xs font-bold tracking-widest uppercase border-2 border-[rgba(0,0,0,0.85)]">
                  Pale Minimalist
                </button>
                <button className="flex-1 py-3 bg-transparent text-black/60 hover:text-black rounded-xl text-xs font-bold tracking-widest uppercase border-2 border-[rgba(0,0,0,0.1)] hover:border-black transition-colors">
                  Cyber Dark
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-black">Hardware Acceleration</p>
                <p className="text-xs text-black/60 font-medium">Enable GSAP GPU optimizations</p>
              </div>
              <div className="w-12 h-6 bg-[rgba(52,199,89,0.2)] rounded-full relative cursor-pointer border border-[rgba(52,199,89,0.5)]">
                <div className="w-4 h-4 bg-[#34c759] rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
