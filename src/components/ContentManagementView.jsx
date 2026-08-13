import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { updateContent } from '../services/contentService';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  User,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Tag,
  Pencil,
  Trash2
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function ContentManagementView({
  selectedChannelFilter,
  setSelectedChannelFilter,
  selectedStatusFilter,
  setSelectedStatusFilter,
  globalSearch,
  onOpenCreateModal,
  onOpenContentDetails,
  onOpenEditContent
}) {
  const {
    contentList,
    contentCount,
    accessibleContent,
    accessibleChannels,
    contentOptionUsers,
    loadContentItems,
    deleteContentItem,
    channels,
    currentUser,
    isAdmin
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState('');
  const [deletingContentId, setDeletingContentId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = localSearch || globalSearch || '';
  const isCompletedTab = selectedStatusFilter === 'Completed';
  const normalizedRole = String(currentUser?.role || '').toLowerCase().replace(/\s+/g, '_');
  const isAdminOrSubadmin = isAdmin || normalizedRole === 'subadmin';
  const showAdminCompletedTable = isCompletedTab && isAdminOrSubadmin;
  const showActionsColumn = !showAdminCompletedTable;
  const tableColSpan = showAdminCompletedTable ? 8 : isCompletedTab ? 11 : 8;
  const canModifyContent = !['editor', 'uploader'].includes(normalizedRole);
  const filteredContent = isCompletedTab ? contentList : accessibleContent;
  const displayCount = isCompletedTab ? contentCount : filteredContent.length;
  const totalPages = Math.max(1, Math.ceil(filteredContent.length / ITEMS_PER_PAGE));
  const shouldShowPagination = filteredContent.length > ITEMS_PER_PAGE;
  const paginationStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContent = filteredContent.slice(paginationStart, paginationStart + ITEMS_PER_PAGE);
  const paginationEnd = Math.min(paginationStart + ITEMS_PER_PAGE, filteredContent.length);
  const filterParams = useMemo(() => ({
    search: searchQuery || undefined,
    channel: selectedChannelFilter,
    status: selectedStatusFilter,
    priority: priorityFilter,
    assignedUser: userFilter
  }), [searchQuery, selectedChannelFilter, selectedStatusFilter, priorityFilter, userFilter]);

  useEffect(() => {
    setIsLoadingContent(true);
    setContentError('');

    loadContentItems(filterParams)
      .catch((err) => {
        setContentError(err.response?.data?.message || 'Content load nahi ho saka.');
      })
      .finally(() => setIsLoadingContent(false));
  }, [filterParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterParams]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const handleDeleteContent = async (item) => {
    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;

    setDeletingContentId(item.id);
    setContentError('');

    try {
      await deleteContentItem(item.id);
    } catch (err) {
      setContentError(err.response?.data?.message || 'Content delete nahi ho saka.');
    } finally {
      setDeletingContentId(null);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatingStatusId(itemId);

    try {
      await updateContent(itemId, { status: newStatus });
      await loadContentItems(filterParams);
    } catch (err) {
      setContentError(err.response?.data?.message || 'Status update nahi ho saka.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return '';

    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? String(dateValue) : parsedDate.toLocaleString();
  };

  const getUserDisplayName = (user) => {
    return user?.fullName || user?.name || user?.email || '';
  };

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
              {displayCount} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track research, scripting, editing, and uploading statuses across assigned channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canModifyContent && ((isAdmin || currentUser?.role === 'subadmin') || selectedStatusFilter !== 'Completed') && (
            <button
              onClick={onOpenCreateModal}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              id="new-content-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Create Content</span>
            </button>
          )}
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
              {contentOptionUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`${showAdminCompletedTable ? 'min-w-[1320px]' : isCompletedTab ? 'min-w-[1560px]' : 'min-w-[1120px]'} w-full text-left text-xs table-fixed border-collapse`}>
              <colgroup>
                {showAdminCompletedTable ? (
                  <>
                    <col className="w-[160px]" />
                    <col className="w-[220px]" />
                    <col className="w-[320px]" />
                    <col className="w-[110px]" />
                    <col className="w-[140px]" />
                    <col className="w-[170px]" />
                    <col className="w-[170px]" />
                    <col className="w-[150px]" />
                  </>
                ) : (
                  <>
                    <col className={isCompletedTab ? 'w-[320px]' : 'w-[360px]'} />
                    <col className="w-[130px]" />
                    <col className="w-[130px]" />
                    <col className="w-[90px]" />
                    <col className="w-[70px]" />
                    <col className="w-[120px]" />
                    <col className="w-[150px]" />
                    {isCompletedTab && (
                      <>
                        <col className="w-[130px]" />
                        <col className="w-[170px]" />
                        <col className="w-[120px]" />
                      </>
                    )}
                  </>
                )}
                {showActionsColumn && <col className="w-[190px]" />}
              </colgroup>
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  {showAdminCompletedTable ? (
                    <>
                      <th className="py-3 px-4 align-middle">Channel Name</th>
                      <th className="py-3 px-4 align-middle">URL</th>
                      <th className="py-3 px-4 align-middle">Title</th>
                      <th className="py-3 px-4 align-middle">Role</th>
                      <th className="py-3 px-4 align-middle">Name</th>
                      <th className="py-3 px-4 align-middle">Start Date Time</th>
                      <th className="py-3 px-4 align-middle">End Date Time</th>
                      <th className="py-3 px-4 align-middle">Total Duration</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4 align-middle">ID & Title</th>
                      <th className="py-3 px-4 align-middle">Channel</th>
                      <th className="py-3 px-4 align-middle">Status</th>
                      <th className="py-3 px-4 align-middle">Priority</th>
                      <th className="py-3 px-4 align-middle">Type</th>
                      <th className="py-3 px-4 align-middle">Assigned To</th>
                      <th className="py-3 px-4 align-middle">Source Creator</th>
                      {isCompletedTab && (
                        <>
                          <th className="py-3 px-4 align-middle">Completed Stage</th>
                          <th className="py-3 px-4 align-middle">Completed At</th>
                          <th className="py-3 px-4 align-middle">Completed By</th>
                        </>
                      )}
                    </>
                  )}
                  {showActionsColumn && (
                    <th className="py-3 px-4 text-right align-middle">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {contentError && (
                  <tr>
                    <td colSpan={tableColSpan} className="py-4 px-4 text-center text-red-600 font-medium">
                      {contentError}
                    </td>
                  </tr>
                )}

                {isLoadingContent ? (
                  <tr>
                    <td colSpan={tableColSpan} className="py-12 text-center text-slate-400">
                      Loading content...
                    </td>
                  </tr>
                ) : !contentError && filteredContent.length === 0 ? (
                  <tr>
                    <td colSpan={tableColSpan} className="py-12 text-center text-slate-400">
                      No content items found matching current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedContent.map((item) => {
                    const channel = item.channel || channels.find((c) => c.id === item.channelId);
                    const assignedUser = item.assignedUser || contentOptionUsers.find((u) => u.id === item.assignedUserId);
                    const completedByUser = typeof item.completedBy === 'object'
                      ? item.completedBy
                      : contentOptionUsers.find((u) => u.id === item.completedBy);
                    const completedAt = item.completedAt
                      ? new Date(item.completedAt).toLocaleString()
                      : '';
                    const completedByName = item.userName || item.completedByName || getUserDisplayName(completedByUser);
                    const completedByRole = item.roleName || item.completedByRole || item.role || completedByUser?.role || 'N/A';
                    const completionStartAt = formatDateTime(item.completionStartAt || item.createdAt || item.createdDate);
                    const completionEndAt = formatDateTime(item.completionEndAt || item.completedAt || item.updatedAt || item.updatedDate);
                    const channelName = item.channelName || channel?.name || channel?.channelName || 'Unknown Channel';
                    const detailsId = item.contentId || item.id;
                    const canOpenDetails = !showAdminCompletedTable;

                    return (
                      <tr
                        key={item.rowId || item.id}
                        className={`hover:bg-slate-50/80 transition-colors group align-top ${canOpenDetails ? 'cursor-pointer' : ''}`}
                        onClick={canOpenDetails ? () => onOpenContentDetails(detailsId) : undefined}
                      >
                        {showAdminCompletedTable && (
                          <>
                            <td className="py-4 px-4 align-top">
                              <div className="truncate font-semibold text-slate-800" title={channelName}>
                                {channelName}
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top" onClick={(e) => e.stopPropagation()}>
                              {item.sourceUrl ? (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex max-w-full items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline"
                                  title={item.sourceUrl}
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{item.sourceUrl}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>
                            <td className="py-4 px-4 align-top">
                              <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug break-words">
                                {item.title}
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top">
                              <span className="inline-flex max-w-full rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                                <span className="truncate">{completedByRole}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 align-top">
                              <div className="truncate font-semibold text-slate-800" title={completedByName || 'N/A'}>
                                {completedByName || 'N/A'}
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top text-slate-500 whitespace-nowrap">
                              {completionStartAt || 'N/A'}
                            </td>
                            <td className="py-4 px-4 align-top text-slate-500 whitespace-nowrap">
                              {completionEndAt || 'N/A'}
                            </td>
                            <td className="py-4 px-4 align-top font-semibold text-slate-700">
                              {item.totalCompletionDuration || 'N/A'}
                            </td>
                          </>
                        )}
                        {!showAdminCompletedTable && (
                          <>
                        {/* ID & Title */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-slate-900 group-hover:text-red-600 transition-colors leading-snug break-words">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                          • Created {item.createdDate}
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="py-4 px-4 align-top">
                          <span className="inline-flex max-w-full items-center gap-1 bg-slate-100 text-slate-800 px-2 py-1 rounded font-medium">
                            <span className="truncate">{channel?.name || 'Unknown Channel'}</span>
                          </span>
                        </td>

                        {/* Status dropdown inline */}
                        <td className="py-4 px-4 align-top" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            disabled={isCompletedTab || updatingStatusId === item.id}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
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
                        <td className="py-4 px-4 align-top">
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
                        <td className="py-4 px-4 align-top font-medium text-slate-600">
                          {item.contentType}
                        </td>

                        {/* Assigned To */}
                        <td className="py-4 px-4 align-top">
                          {assignedUser ? (
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className={`w-2 h-2 shrink-0 rounded-full ${assignedUser.avatarColor || 'bg-slate-500'}`} />
                              <span className="truncate font-semibold text-slate-800">
                                {assignedUser.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        {/* Source Creator */}
                        <td className="py-4 px-4 align-top text-slate-500">
                          <div className="truncate" title={item.sourceCreator || 'N/A'}>
                            {item.sourceCreator || 'N/A'}
                          </div>
                        </td>

                        {isCompletedTab && (
                          <>
                            <td className="py-4 px-4 align-top">
                              <span className="inline-flex max-w-full rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                <span className="truncate">{item.completedStage || 'N/A'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 align-top text-slate-500 whitespace-nowrap">
                              {completedAt || 'N/A'}
                            </td>
                            <td className="py-4 px-4 align-top">
                              <span className="block truncate font-semibold text-slate-800">
                                {completedByUser?.fullName || completedByUser?.name || completedByUser?.email || 'N/A'}
                              </span>
                            </td>
                          </>
                        )}
                          </>
                        )}

                        {showActionsColumn && (
                          <td className="py-4 px-4 text-right align-top" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                              <button
                                onClick={() => onOpenContentDetails(detailsId)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors"
                              >
                                Details
                              </button>
                              {!isCompletedTab && canModifyContent && (item.status === 'Pending' || isAdmin || currentUser?.role === 'subadmin') && (
                                <>
                                  <button
                                    onClick={() => onOpenEditContent(item.id)}
                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteContent(item)}
                                    disabled={deletingContentId === item.id}
                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>{deletingContentId === item.id ? 'Deleting...' : 'Delete'}</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {shouldShowPagination && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="font-medium text-slate-500">
                Showing {paginationStart + 1}-{paginationEnd} of {filteredContent.length}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg border text-xs font-bold transition-colors ${
                      currentPage === page
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
