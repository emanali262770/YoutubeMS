import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Search, Filter, Clock, User, ArrowRight, FileText } from 'lucide-react';

export default function ActivityHistoryView({ onOpenContentDetails }) {
  const { activities, contentList } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activities.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.user.toLowerCase().includes(term) ||
      a.action.toLowerCase().includes(term) ||
      a.contentTitle.toLowerCase().includes(term) ||
      a.contentId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Activity & Audit Trail
            </h2>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {filtered.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete change history log across all team content actions and status updates.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Content Record</th>
                <th className="py-3.5 px-4">Status Transition</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {act.dateTime}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {act.user}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 font-bold text-slate-800 rounded text-[10px]">
                        {act.action}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenContentDetails(act.contentId)}
                        className="font-semibold text-slate-900 hover:text-red-600 transition-colors text-left group"
                      >
                        <span className="font-mono text-slate-400 font-normal mr-1.5">
                          {act.contentId}
                        </span>
                        <span className="group-hover:underline">{act.contentTitle}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {act.previousStatus}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-indigo-700 bg-indigo-50 font-bold px-2 py-0.5 rounded text-[10px]">
                          {act.newStatus}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">
                      {act.note || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
