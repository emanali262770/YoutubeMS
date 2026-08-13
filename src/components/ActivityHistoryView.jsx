import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, Trash2 } from 'lucide-react';
import { deleteActivityLogs, getActivityLogs } from '../services/activityLogService';

const ITEMS_PER_PAGE = 10;

export default function ActivityHistoryView({ onOpenContentDetails }) {
  const { contentList, channels, accessibleChannels, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [activityRows, setActivityRows] = useState([]);
  const [activityUserOptions, setActivityUserOptions] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedCurrentRole = String(currentUser?.role || '').toLowerCase().replace(/\s+/g, '_');

  const formatActionType = (action = '') => {
    const normalized = String(action).toLowerCase();

    if (normalized.includes('delete')) return 'Deleted';
    if (normalized.includes('edit') || normalized.includes('update') || normalized.includes('change')) return 'Edited';
    return action || 'Updated';
  };

  const getActionClassName = (actionType) => {
    if (actionType === 'Deleted') return 'bg-red-50 text-red-700 border-red-200';
    if (actionType === 'Edited') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusClassName = (status = '') => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'In Progress') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return 'N/A';

    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? String(dateValue) : parsedDate.toLocaleString();
  };

  const normalizeActivityRow = (row) => {
    const content = row.content || contentList.find((item) => (
      item.id === row.contentId ||
      item.contentId === row.contentId ||
      item.id === row.content?.id ||
      item.contentId === row.content?.id
    ));
    const channel = row.channel || channels.find((item) => (
      item.id === row.channelId ||
      item.id === content?.channelId
    ));
    const assignedToId = content?.assignedTo?.id || content?.assignedUser?.id || content?.assignedUserId || row.assignedTo?.id;
    const status = row.status || content?.status || row.newStatus || 'N/A';
    const role = row.role || row.roleName || user?.role || 'N/A';
    const apiAccess = row.editDeleteAccess;
    const canEditDelete = apiAccess ?? (
      normalizedCurrentRole === 'admin' ||
      normalizedCurrentRole === 'subadmin' ||
      (
        normalizedCurrentRole === 'script_writer' &&
        status === 'Pending' &&
        assignedToId === currentUser?.id
      )
    );

    return {
      id: row.id || row._id,
      contentId: row.contentId || content?.id || content?._id,
      contentTitle: row.contentTitle || content?.title || 'Untitled Content',
      username: row.username || row.userName || row.user?.fullName || row.user?.name || row.user?.email || 'N/A',
      userId: row.userId || row.performedBy || row.user?.id || row.user?._id || '',
      role,
      status,
      dateTime: row.createdAt || row.dateTime || row.updatedAt || '',
      actionType: row.actionLabel || formatActionType(row.action),
      channelId: row.channelId || channel?.id || channel?._id || content?.channelId || '',
      channelName: row.channelName || channel?.name || content?.channelName || 'Unknown Channel',
      canEditDelete: Boolean(canEditDelete)
    };
  };

  const normalizeUserOption = (user) => ({
    id: user.id || user._id || user.userId || user.value || user.username || user.name || user.email,
    label: user.label || user.fullName || user.name || user.username || user.email || 'User'
  });

  const getUserOptionsFromLogs = (logs) => {
    const optionMap = new Map();

    logs.forEach((log) => {
      const row = normalizeActivityRow(log);
      if (!row.userId && row.username === 'N/A') return;

      const id = row.userId || row.username;
      if (!optionMap.has(id)) {
        optionMap.set(id, {
          id,
          label: row.username
        });
      }
    });

    return Array.from(optionMap.values());
  };

  const queryParams = useMemo(() => ({
    search: searchTerm || undefined,
    channel: channelFilter,
    user: userFilter,
    status: statusFilter,
    action: actionFilter,
    page: currentPage,
    limit: ITEMS_PER_PAGE
  }), [searchTerm, channelFilter, userFilter, statusFilter, actionFilter, currentPage]);
  const totalPages = Math.max(1, Math.ceil(eventsCount / ITEMS_PER_PAGE));
  const shouldShowPagination = eventsCount > ITEMS_PER_PAGE;
  const paginationStart = eventsCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const paginationEnd = Math.min(currentPage * ITEMS_PER_PAGE, eventsCount);

  const loadActivityRows = async () => {
    setIsLoading(true);
    setActivityError('');

    try {
      const data = await getActivityLogs(queryParams);
      const logs = data?.logs || data?.data?.logs || [];
      const total = data?.total ?? data?.data?.total ?? logs.length;
      const usersFromApi = data?.users || data?.data?.users || data?.filterOptions?.users || data?.data?.filterOptions?.users;

      setActivityRows(Array.isArray(logs) ? logs.map(normalizeActivityRow) : []);
      if (Array.isArray(usersFromApi)) {
        setActivityUserOptions(usersFromApi.map(normalizeUserOption).filter((user) => user.id));
      } else if (userFilter === 'all') {
        setActivityUserOptions(getUserOptionsFromLogs(Array.isArray(logs) ? logs : []));
      }
      setEventsCount(Number.isFinite(Number(total)) ? Number(total) : 0);
      setSelectedIds([]);
    } catch (err) {
      setActivityRows([]);
      setEventsCount(0);
      setActivityError(err.response?.data?.message || 'Activity logs load nahi ho sake.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivityRows();
  }, [queryParams]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const filtered = activityRows;
  const visibleIds = filtered.map((row) => row.id).filter(Boolean);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length;
  const hasSelectedRows = selectedIds.length > 0;
  const isAllVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  const handleSelectRow = (rowId) => {
    if (!rowId) return;

    setSelectedIds((current) => (
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId]
    ));
  };

  const handleSelectAllVisible = () => {
    setSelectedIds((current) => {
      if (isAllVisibleSelected) {
        return current.filter((id) => !visibleIds.includes(id));
      }

      return [...new Set([...current, ...visibleIds])];
    });
  };

  const handleDeleteSelected = () => {
    if (!hasSelectedRows) return;

    setIsDeleting(true);
    setActivityError('');

    deleteActivityLogs(selectedIds)
      .then(() => loadActivityRows())
      .catch((err) => {
        setActivityError(err.response?.data?.message || 'Selected activity logs delete nahi ho sake.');
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Activity & Audit Trail
            </h2>
            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {eventsCount} Events Logged
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Activity Filters</span>
        </div>

        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={channelFilter}
            onChange={(e) => {
              setChannelFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Channels</option>
            {accessibleChannels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>

          <select
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Users</option>
            {activityUserOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Actions</option>
            <option value="Edited">Edited</option>
            <option value="Deleted">Deleted</option>
            <option value="Updated">Updated</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {hasSelectedRows && (
          <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-4 py-2.5 text-xs">
            <span className="font-semibold text-blue-800">
              {selectedIds.length} selected
            </span>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete selected"
              aria-label="Delete selected"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-[1160px] w-full text-left text-xs table-fixed border-collapse">
            <colgroup>
              <col className="w-[44px]" />
              <col className="w-[320px]" />
              <col className="w-[150px]" />
              <col className="w-[130px]" />
              <col className="w-[120px]" />
              <col className="w-[170px]" />
              <col className="w-[110px]" />
              <col className="w-[160px]" />
            </colgroup>
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={handleSelectAllVisible}
                    disabled={visibleIds.length === 0}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-red-600 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Select all visible rows"
                  />
                </th>
                <th className="py-3.5 px-4">Content Title</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Edit / Delete Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {activityError && (
                <tr>
                  <td colSpan="8" className="py-4 px-4 text-center text-red-600 font-medium">
                    {activityError}
                  </td>
                </tr>
              )}

              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    Loading activity logs...
                  </td>
                </tr>
              ) : !activityError && filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors align-top ${
                      selectedIds.includes(row.id) ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                        aria-label={`Select ${row.contentTitle}`}
                      />
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenContentDetails(row.contentId)}
                        className="max-w-full text-left font-semibold text-slate-900 hover:text-red-600 transition-colors"
                      >
                        <span className="block truncate" title={row.contentTitle}>
                          {row.contentTitle}
                        </span>
                        <span className="mt-1 block truncate text-[10px] font-medium text-slate-400" title={row.channelName}>
                          {row.channelName}
                        </span>
                      </button>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <span className="block truncate" title={row.username}>
                        {row.username}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex max-w-full rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                        <span className="truncate" title={row.role}>
                          {row.role}
                        </span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded border px-2 py-1 text-[11px] font-bold ${getStatusClassName(row.status)}`}>
                        {row.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {formatDateTime(row.dateTime)}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded border px-2 py-1 text-[11px] font-bold ${getActionClassName(row.actionType)}`}>
                        {row.actionType}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {row.canEditOrDelete ? (
                        <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                          Edit / Delete
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {shouldShowPagination && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="font-medium text-slate-500">
              Showing {paginationStart}-{paginationEnd} of {eventsCount}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1 || isLoading}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  disabled={isLoading}
                  className={`h-8 w-8 rounded-lg border text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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
                disabled={currentPage === totalPages || isLoading}
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
