import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Kanban,
  Table as TableIcon,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  User,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Tag
} from 'lucide-react';

export default function ContentManagementView({
  selectedChannelFilter,
  setSelectedChannelFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  globalSearch,
  onOpenCreateModal,
  onOpenContentDetails
}) {
  const {
    accessibleContent,
    accessibleChannels,
    users,
    updateContentItem,
    currentUser,
    channels
  } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [localSearch, setLocalSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  const searchQuery = (localSearch || globalSearch || '').toLowerCase();

  // Filter content items according to search & multi-select filters
  const filteredContent = accessibleContent.filter((item) => {
    // Channel filter
    if (selectedChannelFilter !== 'all' && item.channelId !== selectedChannelFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter !== 'all' && item.status !== selectedStatusFilter) {
      return false;
    }
    // Priority filter
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
      return false;
    }
    // User filter
    if (userFilter !== 'all' && item.assignedUserId !== userFilter) {
      return false;
    }
    // Content type
    if (contentTypeFilter !== 'all' && item.contentType !== contentTypeFilter) {
      return false;
    }
    // Text search
    if (searchQuery) {
      const matchTitle = item.title.toLowerCase().includes(searchQuery);
      const matchCreator = (item.sourceCreator || '').toLowerCase().includes(searchQuery);
      const matchId = item.id.toLowerCase().includes(searchQuery);
      if (!matchTitle && !matchCreator && !matchId) return false;
    }
    return true;
  });

  // Kanban Columns
  const kanbanColumns = [
    { id: 'Pending', label: 'Pending', color: 'border-amber-400 bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' },
    { id: 'In Progress', label: 'In Progress', color: 'border-blue-400 bg-blue-50/50', badge: 'bg-blue-100 text-blue-800' },
    { id: 'Completed', label: 'Completed', color: 'border-emerald-400 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Content Workflow
            </h2>
            <span className="bg-red-100 text-red-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {filteredContent.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track research, scripting, editing, and uploading statuses across assigned channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Table vs Kanban */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            id="new-content-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* Section 13: Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Filter & Search Content</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, creator, ID..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={selectedChannelFilter}
              onChange={(e) => setSelectedChannelFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Accessible Channels</option>
              {accessibleChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Assigned Users</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Display: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID & Title</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Source Creator</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredContent.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400">
                      No content items found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredContent.map((item) => {
                    const channel = channels.find((c) => c.id === item.channelId);
                    const assignedUser = users.find((u) => u.id === item.assignedUserId);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => onOpenContentDetails(item.id)}
                      >
                        {/* ID & Title */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.id} • Created {item.createdDate}
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-1 rounded font-medium">
                            <span>{channel?.avatar || '📺'}</span>
                            <span>{channel?.name || 'Unknown Channel'}</span>
                          </span>
                        </td>

                        {/* Status dropdown inline */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={item.status}
                            onChange={(e) => updateContentItem(item.id, { status: e.target.value })}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none ${
                              item.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : item.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.priority === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : item.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="py-3.5 px-4 font-medium text-slate-600">
                          {item.contentType}
                        </td>

                        {/* Assigned To */}
                        <td className="py-3.5 px-4">
                          {assignedUser ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${assignedUser.avatarColor}`} />
                              <span className="font-semibold text-slate-800">
                                {assignedUser.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Source Creator */}
                        <td className="py-3.5 px-4 text-slate-500 truncate max-w-[150px]">
                          {item.sourceCreator || 'N/A'}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenContentDetails(item.id);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {kanbanColumns.map((col) => {
            const columnItems = filteredContent.filter((c) => c.status === col.id);

            return (
              <div
                key={col.id}
                className={`bg-white rounded-2xl border-t-4 ${col.color} p-4 shadow-xs border border-slate-200`}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{col.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badge}`}>
                      {columnItems.length}
                    </span>
                  </h3>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {columnItems.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs italic">
                      No items in {col.label}
                    </div>
                  ) : (
                    columnItems.map((item) => {
                      const channel = channels.find((c) => c.id === item.channelId);
                      const assignedUser = users.find((u) => u.id === item.assignedUserId);

                      return (
                        <div
                          key={item.id}
                          onClick={() => onOpenContentDetails(item.id)}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-slate-400 font-bold">{item.id}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                                item.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-red-600 transition-colors">
                            {item.title}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                            <span className="truncate max-w-[120px] font-medium text-slate-700">
                              {channel?.avatar} {channel?.name}
                            </span>
                            <span className="font-semibold text-slate-800">
                              {assignedUser?.fullName || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
