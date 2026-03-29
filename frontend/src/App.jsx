import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import UploadForm from './components/Upload/UploadForm';
import Dashboard from './components/Dashboard/Dashboard';
import { getCandidates } from './api';
import { Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to fetch candidates', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchCandidates();
    }
  }, [activeTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Mobile Top Header (Hamburger) */}
      <div className="lg:hidden fixed top-0 w-full glass-panel z-50 flex items-center justify-between p-4 px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">NexusAI</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={24} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
        </button>
      </div>

      {/* Sidebar - Collapsible on Mobile, Sticky on Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} closeMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-0 py-8 scroll-smooth w-full">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {activeTab === 'upload' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <UploadForm onUploadComplete={() => { setActiveTab('dashboard'); fetchCandidates(); }} />
            </div>
          )}
          
          {activeTab === 'dashboard' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Dashboard candidates={candidates} loading={loading} />
             </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
