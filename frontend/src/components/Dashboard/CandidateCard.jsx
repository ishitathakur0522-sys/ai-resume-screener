import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, ChevronDown, ChevronUp, User, Star } from 'lucide-react';

const CandidateCard = ({ candidate, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const { name, matchScore, pros = [], gaps = [], jobContext } = candidate;

  // Determine colors based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-300 shadow-emerald-500/10';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-300 shadow-amber-500/10';
    return 'text-red-500 bg-red-50 border-red-200 shadow-red-500/10';
  };

  const scoreClass = getScoreColor(matchScore);

  const generateRejectionEmail = () => {
    const gapsList = gaps.map(g => `- ${g}`).join('%0A');
    const subject = `Update on your application`;
    const body = `Dear ${name},%0A%0AThank you for applying. After reviewing your profile, we have decided to move forward with other candidates at this time.%0A%0AWhile your background is interesting, we are currently prioritizing candidates with more alignment in the following areas:%0A${gapsList}%0A%0AWe wish you the best in your job search.%0A%0ABest regards,%0AHiring Team`;

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 card-hover flex flex-col h-full relative overflow-hidden group transition-all">
      {/* Top Banner accent if excellent match */}
      {matchScore >= 80 && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 flex-shrink-0 shadow-sm">
            <User className="text-slate-400" size={28} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-xl text-slate-800 line-clamp-1 truncate pr-2" title={name}>{name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md tracking-wide">RANK #{rank}</span>
              {matchScore >= 80 && <Star size={14} className="text-emerald-500 fill-emerald-500" />}
            </div>
          </div>
        </div>
        <div className={`flex flex-col items-center justify-center min-w-[64px] h-[64px] rounded-2xl border-2 ${scoreClass} flex-shrink-0 shadow-sm`}>
          <div className="flex items-baseline">
            <span className="text-2xl font-extrabold">{matchScore}</span>
            <span className="text-sm font-bold ml-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Pros & Gaps Summary */}
      <div className="flex-1 flex flex-col gap-5 mb-8">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-3 tracking-wide uppercase">
            <CheckCircle size={16} className="text-emerald-500" /> Key Strengths
          </h4>
          <ul className="space-y-2.5">
            {pros.slice(0, 2).map((pro, i) => (
              <li key={i} className="text-[0.95rem] text-slate-700 flex items-start gap-3 leading-snug">
                <span className="min-w-[6px] min-h-[6px] mt-2 rounded-full bg-emerald-400 shadow-sm"></span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-red-600 mb-3 tracking-wide uppercase">
            <XCircle size={16} className="text-red-500" /> Identified Gaps
          </h4>
          <ul className="space-y-2.5">
            {gaps.slice(0, 2).map((gap, i) => (
              <li key={i} className="text-[0.95rem] text-slate-700 flex items-start gap-3 leading-snug">
                <span className="min-w-[6px] min-h-[6px] mt-2 rounded-full bg-red-400 shadow-sm"></span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Section */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          {pros.length > 2 && (
            <ul className="space-y-2.5 mb-4">
              {pros.slice(2).map((pro, i) => (
                <li key={'p' + i} className="text-[0.95rem] text-slate-700 flex items-start gap-3 leading-snug">
                  <span className="min-w-[6px] min-h-[6px] mt-2 rounded-full bg-emerald-400 shadow-sm"></span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          )}
          {gaps.length > 2 && (
            <ul className="space-y-2.5 mb-2">
              {gaps.slice(2).map((gap, i) => (
                <li key={'g' + i} className="text-[0.95rem] text-slate-700 flex items-start gap-3 leading-snug">
                  <span className="min-w-[6px] min-h-[6px] mt-2 rounded-full bg-red-400 shadow-sm"></span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {(pros.length > 2 || gaps.length > 2) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 text-sm font-semibold flex items-center self-start hover:text-primary-800 transition-colors py-2 px-1 -ml-1 mt-auto rounded-lg hover:bg-primary-50 min-h-[44px]"
          >
            {expanded ? 'Show Less' : 'Read Full Analysis'}
            {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>
        )}
      </div>

      {/* Action Buttons - Min 44px high for Touch-Friendly */}
      <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-100 mt-auto">
        <button
          onClick={generateRejectionEmail}
          className="flex-1 btn-outline min-h-[48px] border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          title="Draft Rejection Email based on Gaps"
        >
          <Mail size={20} />
          <span>Reject</span>
        </button>
        <button
          className="flex-1 btn-primary min-h-[48px] text-[1.05rem]"
        >
          Shortlist candidate
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
