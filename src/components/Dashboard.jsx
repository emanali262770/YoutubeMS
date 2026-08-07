import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Tv,
  FileText,
  Clock,
  PlayCircle,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Users,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export default function Dashboard({
  onNavigateToContent,
  onNavigateToChannel,
  onOpenContent
}) {
  const {
    currentUser,
    isAdmin,
    accessibleChannels,
    accessibleContent,
    activities
  } = useApp();

  // Overall Statistics for current user's channel scope
  const totalChannels = accessibleChannels.length;
  const totalContent = accessibleContent.length;
  const pendingCount = accessibleContent.filter(c => c.status === 'Pending').length;
  const inProgressCount = accessibleContent.filter(c => c.status === 'In Progress').length;
  const completedCount = accessibleContent.filter(c => c.status === 'Completed').length;

  // Channel-based Statistics
  const channelStats = accessibleChannels.map(ch => {
    const channelContent = accessibleContent.filter(c => c.channelId === ch.id);
    const pending = channelContent.filter(c => c.status === 'Pending').length;
    const inProgress = channelContent.filter(c => c.status === 'In Progress').length;
    const completed = channelContent.filter(c => c.status === 'Completed').length;

    return {
      channel: ch,
      total: channelContent.length,
      pending,
      inProgress,
      completed
    };
  });

  // Recent Priority Content (Top 4)
  const priorityItems = accessibleContent
    .filter(c => c.priority === 'High' && c.status !== 'Completed')
    .slice(0, 4);

  // Recent Activity Feed for user's scope
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {currentUser.role} View
              </span>
              {!isAdmin && (
                <span className="bg-slate-700/80 text-slate-300 text-[11px] px-2.5 py-0.5 rounded-full">
                  Assigned Channels Only
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {currentUser.fullName}
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              {isAdmin
                ? "You have full administrator access to all YouTube channels, content workflows, and team management."
                : `Managing production workflows across your ${totalChannels} assigned YouTube channel(s).`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToContent('all', 'all')}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View All Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 11: Overall Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
            <span>Overall Statistics</span>
            <span className="text-xs font-normal text-slate-500">
              ({isAdmin ? 'Global System' : 'Your Scope'})
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Card 1: Total Channels */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Channels</span>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Tv className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalChannels}</div>
            <p className="text-[10px] text-slate-400 mt-1">Active channels</p>
          </div>

          {/* Card 2: Total Content */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Content</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalContent}</div>
            <p className="text-[10px] text-slate-400 mt-1">All videos tracked</p>
          </div>

          {/* Card 3: Pending */}
          <div
            onClick={() => onNavigateToContent('all', 'Pending')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium text-amber-700">Pending</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <p className="text-[10px] text-amber-700/80 mt-1">Awaiting action</p>
          </div>

          {/* Card 4: In Progress */}
          <div
            onClick={() => onNavigateToContent('all', 'In Progress')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium text-blue-700">In Progress</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-105 transition-transform">
                <PlayCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-[10px] text-blue-700/80 mt-1">Active script/edit</p>
          </div>

          {/* Card 5: Completed */}
          <div
            onClick={() => onNavigateToContent('all', 'Completed')}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium text-emerald-700">Completed</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
            <p className="text-[10px] text-emerald-700/80 mt-1">Published or ready</p>
          </div>
        </div>
      </div>

      {/* Section 11: Channel-Based Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">
            Channel-Based Breakdown
          </h3>
          <span className="text-xs text-slate-500">
            {isAdmin ? 'All Channels (Admin View)' : `Showing ${accessibleChannels.length} Assigned Channel(s)`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channelStats.map(({ channel, total, pending, inProgress, completed }) => {
            const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={channel.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-slate-50 rounded-lg border border-slate-100">
                      {channel.avatar || '📺'}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {channel.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {channel.category} • {channel.language}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateToContent(channel.id, 'all')}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Filter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Completion Rate</span>
                    <span className="font-bold text-slate-700">{completedPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      style={{ width: `${(completed / (total || 1)) * 100}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Completed: ${completed}`}
                    />
                    <div
                      style={{ width: `${(inProgress / (total || 1)) * 100}%` }}
                      className="bg-blue-500 h-full"
                      title={`In Progress: ${inProgress}`}
                    />
                    <div
                      style={{ width: `${(pending / (total || 1)) * 100}%` }}
                      className="bg-amber-400 h-full"
                      title={`Pending: ${pending}`}
                    />
                  </div>
                </div>

                {/* Grid metrics */}
                <div className="grid grid-cols-4 gap-2 text-center pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-amber-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-amber-700 font-medium">Pending</div>
                    <div className="font-bold text-amber-800 text-sm">{pending}</div>
                  </div>
                  <div className="bg-blue-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-blue-700 font-medium">Progress</div>
                    <div className="font-bold text-blue-800 text-sm">{inProgress}</div>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-emerald-700 font-medium">Done</div>
                    <div className="font-bold text-emerald-800 text-sm">{completed}</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-600 font-medium">Total</div>
                    <div className="font-bold text-slate-900 text-sm">{total}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: High Priority Content & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Content items requiring attention */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>High Priority Content</span>
            </h3>
            <button
              onClick={() => onNavigateToContent('all', 'all')}
              className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
            >
              View all →
            </button>
          </div>

          {priorityItems.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg">
              No high priority items pending.
            </div>
          ) : (
            <div className="space-y-3">
              {priorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenContent(item.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        HIGH
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.id}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Creator: {item.sourceCreator || 'N/A'} • Stage: {item.workflowStage || item.status}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 14: Activity History Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Recent Activity Log</span>
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100 space-y-1"
              >
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block" />
                    {act.user}
                  </span>
                  <span>{act.dateTime}</span>
                </div>
                <div className="text-slate-800 font-medium">
                  {act.action}:{' '}
                  <span className="text-slate-500">{act.previousStatus}</span> →{' '}
                  <span className="text-indigo-600 font-bold">{act.newStatus}</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">"{act.contentTitle}"</p>
                {act.note && (
                  <p className="text-[10px] text-slate-400">Note: {act.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
