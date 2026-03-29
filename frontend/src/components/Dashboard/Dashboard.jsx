import React from 'react';
import CandidateCard from './CandidateCard';
import { Loader2, Users } from 'lucide-react';

const Dashboard = ({ candidates, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 w-full">
        <Loader2 size={48} className="text-primary-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse text-lg">NexusAI is analyzing candidates...</p>
      </div>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-5 bg-white rounded-3xl border-2 border-dashed border-slate-200 w-full shadow-sm">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center shadow-inner">
          <Users size={36} className="text-primary-400" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No Candidates Yet</h3>
          <p className="text-slate-500 max-w-sm text-center">Navigate to the Upload tab to provide a job description and resumes for analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-2 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Candidate Dashboard</h2>
          <button
            onClick={async () => {
              if (window.confirm("Clear all candidates?")) {
                await fetch("http://localhost:5000/api/clear", {
                  method: "DELETE",
                });
                window.location.reload();
              }
            }}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              background: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear Dashboard
          </button>
          <p className="text-slate-500 mt-1">Showing {candidates.length} processed resumes, ranked by match score.</p>
        </div>
      </div>

      {/* Screen-Agile grid: 1 col mobile, 2 tablet, 3 desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
        {candidates.map((candidate, idx) => (
          <div key={candidate._id || candidate.filename || idx} className="h-full">
            <CandidateCard candidate={candidate} rank={idx + 1} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
