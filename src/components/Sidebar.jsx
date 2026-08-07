import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Tv,
  FileText,
  Clock,
  Users,
  Settings,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  ListOrdered,
  Plus,
  Activity
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  selectedChannelFilter,
  setSelectedChannelFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  onOpenCreateChannel
}) {
  const { currentUser, isAdmin, accessibleChannels, channels } = useApp();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Current Active User Access Badge */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isAdmin ? 'bg-purple-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="text-xs font-semibold text-slate-200">
            {isAdmin ? 'ADMIN SYSTEM ACCESS' : `${currentUser.role.toUpperCase()} MODE`}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
          {isAdmin
            ? 'Full privileges: All channels & users'
            : `Assigned: ${accessibleChannels.map(c => c.name).join(', ') || 'No Channels'}`}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto text-xs">
        {/* Main Navigation */}
        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedChannelFilter('all');
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            id="nav-dashboard-btn"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>{isAdmin ? 'Channels' : 'My Channels'}</span>
            {isAdmin && (
              <button
                onClick={onOpenCreateChannel}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Add New Channel"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('channels');
                setSelectedChannelFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'channels' && selectedChannelFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-500" />
                <span>All Channels</span>
              </div>
              <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
                {accessibleChannels.length}
              </span>
            </button>

            {/* Accessible Channels List */}
            <div className="pl-3 space-y-1 border-l border-slate-800 ml-3 my-1">
              {accessibleChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveTab('content');
                    setSelectedChannelFilter(ch.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-normal transition-colors cursor-pointer ${
                    activeTab === 'content' && selectedChannelFilter === ch.id
                      ? 'bg-red-950/60 text-red-300 font-medium border-l-2 border-red-500'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span>{ch.avatar || '📺'}</span>
                    <span className="truncate">{ch.name}</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Content Workflow
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('content');
                setSelectedStatusFilter('all');
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'content' && selectedStatusFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-500" />
              <span>All Content</span>
            </button>

            <div className="pl-3 space-y-0.5 border-l border-slate-800 ml-3">
              <button
                onClick={() => {
                  setActiveTab('content');
                  setSelectedStatusFilter('Pending');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeTab === 'content' && selectedStatusFilter === 'Pending'
                    ? 'bg-amber-950/50 text-amber-300 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Pending</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('content');
                  setSelectedStatusFilter('In Progress');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeTab === 'content' && selectedStatusFilter === 'In Progress'
                    ? 'bg-blue-950/50 text-blue-300 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>In Progress</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('content');
                  setSelectedStatusFilter('Completed');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  activeTab === 'content' && selectedStatusFilter === 'Completed'
                    ? 'bg-emerald-950/50 text-emerald-300 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Completed</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div>
          <button
            onClick={() => setActiveTab('activity')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Activity History</span>
          </button>
        </div>

        {/* Admin Management Section */}
        {isAdmin && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Admin Management
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
                id="nav-users-btn"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Users & Roles</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
                id="nav-settings-btn"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer Role Notice */}
      <div className="p-3 bg-slate-950 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
        <span>Logged in: {currentUser.fullName}</span>
        <span className="font-semibold text-slate-200">{currentUser.role}</span>
      </div>
    </aside>
  );
}
