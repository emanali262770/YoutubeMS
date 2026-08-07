import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tv,
  Plus,
  Globe,
  Tag,
  Users,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ChannelsView({
  onSelectChannelFilter,
  onOpenCreateChannel
}) {
  const {
    channels,
    accessibleChannels,
    accessibleContent,
    users,
    isAdmin
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');

  const filteredChannels = accessibleChannels.filter(ch =>
    ch.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.language.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              YouTube Channels
            </h2>
            <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {accessibleChannels.length} Channels
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin
              ? 'Manage all channels in the organization and assign access to team members.'
              : 'Viewing channels assigned to your account profile.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {isAdmin && (
            <button
              onClick={onOpenCreateChannel}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              id="create-channel-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add Channel</span>
            </button>
          )}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChannels.map((channel) => {
          const channelContent = accessibleContent.filter(c => c.channelId === channel.id);
          const pendingCount = channelContent.filter(c => c.status === 'Pending').length;
          const inProgressCount = channelContent.filter(c => c.status === 'In Progress').length;
          const completedCount = channelContent.filter(c => c.status === 'Completed').length;

          // Team members with access to this channel
          const assignedTeam = users.filter(u =>
            u.role === 'Admin' || (u.assignedChannelIds || []).includes(channel.id)
          );

          return (
            <div
              key={channel.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-100">
                      {channel.avatar || '📺'}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        {channel.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {channel.language}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {channel.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-emerald-200">
                    {channel.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 my-3">
                  {channel.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Total</div>
                    <div className="font-bold text-slate-900 text-sm">{channelContent.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-amber-600 uppercase">Pending</div>
                    <div className="font-bold text-amber-700 text-sm">{pendingCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-emerald-600 uppercase">Completed</div>
                    <div className="font-bold text-emerald-700 text-sm">{completedCount}</div>
                  </div>
                </div>

                {/* Team Members assigned */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Assigned Team Access ({assignedTeam.length})</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    {assignedTeam.map((u) => (
                      <span
                        key={u.id}
                        title={`${u.fullName} (${u.role})`}
                        className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.avatarColor || 'bg-slate-500'}`} />
                        <span className="font-medium">{u.fullName}</span>
                        <span className="text-slate-400">({u.role})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectChannelFilter(channel.id)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Channel Content ({channelContent.length})</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
