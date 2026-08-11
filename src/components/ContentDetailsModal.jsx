import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getActivityHistory } from '../services/contentService';
import {
  X,
  FileText,
  History
} from 'lucide-react';

export default function ContentDetailsModal({ contentId, onClose }) {
  const {
    contentList,
    currentUser
  } = useApp();

  const item = contentList.find((c) => c.id === contentId);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history'
  const [activityHistory, setActivityHistory] = useState([]);
  const [totalDuration, setTotalDuration] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Fetch activity history when tab changes
  useEffect(() => {
    if (activeTab === 'history' && contentId) {
      setIsLoadingHistory(true);
      setHistoryError('');

      getActivityHistory(contentId)
        .then((data) => {
          setActivityHistory(data.activityHistory || []);
          setTotalDuration(data.totalDuration || null);
        })
        .catch((err) => {
          setHistoryError(err.response?.data?.message || 'Activity history load nahi ho saka.');
        })
        .finally(() => setIsLoadingHistory(false));
    }
  }, [activeTab, contentId]);

  if (!item) return null;

  // Get channel from item (API response) instead of searching
  const channel = item.channel || {};
  const assignedUser = item.assignedTo || {};
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden text-slate-800 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <span>{channel.avatarEmoji || channel.avatar || '📺'}</span>
                <span>{channel.name || 'Channel'}</span>
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Overview & Status</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity History</span>
          </button>
        </div>

        {/* Modal Tab Contents */}
        <div className="p-6 text-xs max-h-[60vh] overflow-y-auto space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Source URL */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-700 mb-2">Source URL (YouTube / Website)</label>
                <div className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-600 break-all">
                  {item.sourceUrl || '-'}
                </div>
              </div>

              {/* Content Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Working Title</label>
                    <div className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium">
                      {item.title || '-'}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Source Creator</label>
                    <div className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900">
                      {item.sourceCreator || '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status</label>
                      <div className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900">
                        {item.status || '-'}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Priority</label>
                      <div className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-xs text-slate-900">
                        {item.priority || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Primary User</label>
                    <div className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900">
                      {assignedUser.fullName ? `${assignedUser.fullName} (${assignedUser.role})` : 'Unassigned'}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    <div>Created Date: <span className="font-semibold text-slate-700">{formatDate(item.createdAt)}</span></div>
                    <div>Last Updated: <span className="font-semibold text-slate-700">{formatDate(item.updatedAt)}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY HISTORY LOG */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {isLoadingHistory ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  Loading activity history...
                </div>
              ) : historyError ? (
                <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl font-medium">
                  {historyError}
                </div>
              ) : activityHistory.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No activity logged for this item yet.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300">
                          <th className="px-4 py-2 text-left font-bold text-slate-700">Status</th>
                          <th className="px-4 py-2 text-left font-bold text-slate-700">Date & Time</th>
                          <th className="px-4 py-2 text-left font-bold text-slate-700">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityHistory.map((act) => (
                          <tr key={`${act.status}-${act.dateTime}`} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-700 font-semibold">
                              {act.transition || act.status}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {new Date(act.dateTime).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-semibold">
                              {act.duration || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Overall Total Duration */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-4">
                    {totalDuration && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-600 mb-2">Total Duration</div>
                        <div className="text-base font-bold text-red-600">
                          {totalDuration}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Role: <span className="font-semibold text-slate-700">{currentUser.role}</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
