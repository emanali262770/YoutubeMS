import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Tv,
  Plus,
  Globe,
  Tag,
  FileText,
  Search
} from 'lucide-react';

export default function ChannelsView({
  onSelectChannelFilter,
  onOpenCreateChannel
}) {
  const {
    accessibleChannels,
    accessibleContent,
    isAdmin
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');

  const formatContentType = (value) =>
    value === 'short' ? 'Short Content' : 'Long Content';

  const formatDate = (value) => {
    if (!value) return 'N/A';

    return new Date(value).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const filteredChannels = accessibleChannels.filter(ch =>
    ch.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.language.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.contentType.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          {/* Header Text */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                YouTube Channels
              </h2>

              <span className="shrink-0 bg-slate-100 text-slate-700 font-bold text-[11px] sm:text-xs px-2.5 py-1 rounded-full">
                {accessibleChannels.length} Channels
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isAdmin
                ? 'Manage all channels in the organization and assign access to team members.'
                : 'Viewing channels assigned to your account profile.'}
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto">

            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                type="text"
                placeholder="Search channels..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            {isAdmin && (
              <button
                onClick={onOpenCreateChannel}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                id="create-channel-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Add Channel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">

        {filteredChannels.map((channel) => {
          const channelContent = accessibleContent.filter(
            c => c.channelId === channel.id
          );

          const pendingCount = channelContent.filter(
            c => c.status === 'Pending'
          ).length;

          const inProgressCount = channelContent.filter(
            c => c.status === 'In Progress'
          ).length;

          const completedCount = channelContent.filter(
            c => c.status === 'Completed'
          ).length;

          return (
            <div
              key={channel.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col min-w-0 h-full"
            >

              {/* Card Content */}
              <div className="flex-1 min-w-0">

                {/* Top Section */}
                <div className="flex items-start justify-between gap-3 mb-4">

                  <div className="flex items-start gap-3 min-w-0 flex-1">

                    {/* Avatar */}
                    <div className="shrink-0">
                      <span className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl bg-slate-50 rounded-xl border border-slate-100">
                        {channel.avatar || '📺'}
                      </span>
                    </div>

                    {/* Channel Information */}
                    <div className="min-w-0 flex-1">

                      <h3
                        className="font-bold text-slate-900 text-base sm:text-lg leading-snug break-words"
                        title={channel.name}
                      >
                        {channel.name}
                      </h3>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">

                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium">
                          <Globe className="w-3 h-3 shrink-0 text-slate-400" />
                          <span>{channel.language}</span>
                        </span>

                        <span
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-md font-medium max-w-full"
                          title={channel.category}
                        >
                          <Tag className="w-3 h-3 shrink-0 text-slate-400" />
                          <span className="break-words">
                            {channel.category}
                          </span>
                        </span>

                        <span className="inline-flex items-center text-[10px] sm:text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded-md font-bold whitespace-nowrap">
                          {formatContentType(channel.contentType)}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <span className="shrink-0 bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full uppercase border border-emerald-200">
                    {channel.status}
                  </span>
                </div>

                {/* Created Information */}
                <div className="grid grid-cols-1 min-[430px]:grid-cols-2 gap-2 sm:gap-3 mb-4">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 min-w-0">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                      Created By
                    </div>

                    <div
                      className="mt-1 font-bold text-xs sm:text-sm text-slate-800 truncate"
                      title={channel.createdBy?.fullName || 'N/A'}
                    >
                      {channel.createdBy?.fullName || 'N/A'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
                      Created On
                    </div>

                    <div className="mt-1 font-bold text-xs sm:text-sm text-slate-800 whitespace-nowrap">
                      {formatDate(channel.createdAt)}
                    </div>
                  </div>

                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-4">

                  <div className="text-center py-3 px-1">
                    <div className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase">
                      Total
                    </div>

                    <div className="font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                      {channelContent.length}
                    </div>
                  </div>

                  <div className="text-center py-3 px-1 border-x border-slate-200/70">
                    <div className="text-[9px] sm:text-[10px] font-semibold text-amber-600 uppercase">
                      Pending
                    </div>

                    <div className="font-bold text-amber-700 text-base sm:text-lg mt-0.5">
                      {pendingCount}
                    </div>
                  </div>

                  <div className="text-center py-3 px-1">
                    <div className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 uppercase">
                      Completed
                    </div>

                    <div className="font-bold text-emerald-700 text-base sm:text-lg mt-0.5">
                      {completedCount}
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectChannelFilter(channel.id)}
                className="w-full min-h-10 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-auto"
              >
                <FileText className="w-4 h-4 shrink-0" />

                <span className="truncate">
                  View Channel Content ({channelContent.length})
                </span>
              </button>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredChannels.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl py-12 px-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center">
            <Tv className="w-6 h-6 text-slate-400" />
          </div>

          <h3 className="font-bold text-slate-800 mt-3">
            No channels found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search filter.
          </p>
        </div>
      )}

    </div>
  );
}
