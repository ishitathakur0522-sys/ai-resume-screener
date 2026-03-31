import React from 'react';
import { LayoutDashboard, FileUp, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, closeMobile }) => {
  const switchTab = (tab) => {
    setActiveTab(tab);
    closeMobile();
  };

  return (
    <div className="w-72 h-full bg-white border-r border-slate-200 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] flex flex-col">
      <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-100">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-2.5 shadow-md shadow-primary-500/20">
          <ShieldCheck size={26} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          NexusAI
        </h1>
      </div>

      <div className="px-4 py-8 flex-1 flex flex-col gap-3 relative mt-16 lg:mt-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Menu</p>

        <button
          onClick={() => switchTab('upload')}
          className={`nav-item w-full ${activeTab === 'upload' ? 'active shadow-sm' : ''}`}
        >
          <FileUp size={22} className={activeTab === 'upload' ? 'text-primary-600' : 'text-slate-400'} />
          <span className="text-[1.05rem]">Upload & Analyze</span>
        </button>

        <button
          onClick={() => switchTab('dashboard')}
          className={`nav-item w-full ${activeTab === 'dashboard' ? 'active shadow-sm' : ''}`}
        >
          <LayoutDashboard size={22} className={activeTab === 'dashboard' ? 'text-primary-600' : 'text-slate-400'} />
          <span className="text-[1.05rem]">Candidate Dashboard</span>
        </button>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-300 flex items-center justify-center text-primary-700 font-bold shadow-sm">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">Jane Doe</span>
            <span className="text-xs text-slate-500 font-medium">Head of Talent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
