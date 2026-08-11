import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  createUser,
  deleteUser as deleteUserApi,
  getUsers,
  updateUserChannels
} from '../services/userService';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Tv,
  Edit2,
  Lock,
  Mail,
  Calendar,
  Key,
  Layers,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserManagementView() {
  const {
    channels,
    addUser,
    updateUser,
    deleteUser,
    isAdmin,
    currentUser
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('subadmin');
  const [status, setStatus] = useState('Active');
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [apiUsers, setApiUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [accessError, setAccessError] = useState('');
  const [isSavingAccess, setIsSavingAccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const tableUsers = apiUsers;

  const formatRole = (value) => {
    const roleMap = {
      admin: 'Admin',
      subadmin: 'Subadmin',
      script_writer: 'Script Writer',
      editor: 'Editor',
      uploader: 'Uploader'
    };

    return roleMap[value] || value || 'Subadmin';
  };

  const formatStatus = (value) => {
    if (!value) return 'Active';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatLastLogin = (value) => {
    if (!value) return 'Never';
    return new Date(value).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUser = (item) => {
    const user = item?.user || item;

    return {
      id: item?.id || item?._id || user?.id || user?._id,
      fullName: user?.fullName || user?.name || user?.email || 'User',
      email: user?.email || '',
      avatarText: user?.avatarText || user?.fullName?.charAt(0) || 'U',
      role: formatRole(item?.role || user?.role),
      status: formatStatus(item?.accountStatus || item?.status || user?.accountStatus || user?.status),
      assignedChannelIds: item?.assignedChannelIds || item?.assignedChannels || user?.assignedChannelIds || user?.assignedChannels || [],
      lastLogin: formatLastLogin(item?.lastLogin || user?.lastLogin),
      avatarColor: item?.avatarColor || user?.avatarColor || 'bg-purple-600'
    };
  };

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      setUsersError('');

      try {
        const response = await getUsers();
        const usersList = response?.users || response?.data?.users || response?.data || response;
        setApiUsers(Array.isArray(usersList) ? usersList.map(formatUser) : []);
      } catch (err) {
        setUsersError(err.response?.data?.message || 'Users load nahi ho sake.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('subadmin');
    setStatus('Active');
    setSelectedChannelIds([channels[0]?.id || '']);
    setFormError('');
    setShowAddModal(true);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) return;

    setFormError('');
    setIsSaving(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role
      };
      const response = await createUser(payload);
      const apiUser = response?.user || response?.data?.user || response?.data || response;
      const newUser = formatUser({
        ...apiUser,
        fullName: apiUser?.fullName || payload.fullName,
        email: apiUser?.email || payload.email,
        role: apiUser?.role || payload.role,
        status: apiUser?.status || status,
        assignedChannelIds: apiUser?.assignedChannelIds || apiUser?.assignedChannels || selectedChannelIds
      });

      setApiUsers(prev => [newUser, ...prev]);
      addUser(newUser);

      setShowAddModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'User create nahi ho saka.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);

    try {
      await deleteUserApi(userId);
      setApiUsers(prev => prev.filter(user => user.id !== userId));
      deleteUser(userId);
    } catch (err) {
      alert(err.response?.data?.message || 'User delete nahi ho saka.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleSaveChannelAccess = async () => {
    const assignedChannels = selectedChannelIds.filter(Boolean);

    setAccessError('');
    setIsSavingAccess(true);

    try {
      const response = await updateUserChannels(editingUserId, assignedChannels);
      const apiUser = response?.user || response?.data?.user || response?.data || response;
      const updatedChannelIds = apiUser?.assignedChannelIds || apiUser?.assignedChannels || assignedChannels;

      setApiUsers(prev => prev.map(user => (
        user.id === editingUserId
          ? { ...user, assignedChannelIds: updatedChannelIds }
          : user
      )));
      updateUser(editingUserId, { assignedChannelIds: updatedChannelIds });
      setEditingUserId(null);
    } catch (err) {
      setAccessError(err.response?.data?.message || 'Channel access update nahi ho saka.');
    } finally {
      setIsSavingAccess(false);
    }
  };

  const toggleChannelSelection = (channelId) => {
    setSelectedChannelIds(prev =>
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              User Management & Access Control
            </h2>
            <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-0.5 rounded-full">
              {tableUsers.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage system users, assign roles, and grant channel access permissions.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            id="create-user-btn"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        )}
      </div>

      {/* Architecture Rule Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-4 rounded-xl border border-purple-800/80 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-200">Architecture Guarantee:</span> Role and Channel Access are completely separate. One user can have a specific functional role (e.g. Editor) across multiple specific assigned channels while having zero access to unassigned channels.
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {usersError && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {usersError}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Assigned Channels</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoadingUsers && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              )}

              {!isLoadingUsers && tableUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}

              {!isLoadingUsers && tableUsers.map((u) => {
                const assignedChans = u.role === 'Admin'
                  ? channels
                  : channels.filter(c => (u.assignedChannelIds || []).includes(c.id));

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${u.avatarColor || 'bg-slate-600'} text-white rounded-lg text-xs font-bold flex items-center justify-center shrink-0`}>
                          {u.avatarText || u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        u.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.role === 'Editor'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'Script Writer'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                        u.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`} />
                        {u.status}
                      </span>
                    </td>

                    {/* Assigned Channels */}
                    <td className="py-3.5 px-4">
                      {u.role === 'Admin' ? (
                        <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                          All Channels Access
                        </span>
                      ) : (
                        <div className="flex items-center flex-wrap gap-1">
                          {assignedChans.length === 0 ? (
                            <span className="text-slate-400 italic text-[11px]">No channels assigned</span>
                          ) : (
                            assignedChans.map((c) => (
                              <span
                                key={c.id}
                                className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium border border-slate-200"
                              >
                                {c.avatar} {c.name}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {u.lastLogin || 'Never'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {(isAdmin || currentUser.role === 'subadmin') && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingUserId(u.id);
                              setSelectedChannelIds(u.assignedChannelIds || []);
                              setAccessError('');
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-[11px] transition-colors cursor-pointer"
                          >
                            Manage Access
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingUserId === u.id || currentUser.id === u.id}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded font-medium text-[11px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingUserId === u.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden text-slate-800">
            <div className="bg-purple-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-base">Create New User Account</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 bg-purple-800 text-slate-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@ytms.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="subadmin">Subadmin</option>
                    <option value="script_writer">Script Writer</option>
                    <option value="editor">Editor</option>
                    <option value="uploader">Uploader</option>
                  </select>
                </div>
              </div>

              {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSaving ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDITING USER CHANNEL ACCESS MODAL */}
      {editingUserId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-800">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Manage Channel Access</h3>
              <button onClick={() => setEditingUserId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Check or uncheck channels to update channel-level authorization for this team member.
              </p>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {channels.map((ch) => {
                  const isChecked = selectedChannelIds.includes(ch.id);
                  return (
                    <label
                      key={ch.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChannelSelection(ch.id)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-bold text-slate-900">{ch.avatar} {ch.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{ch.language}</span>
                    </label>
                  );
                })}
              </div>

              {accessError && (
                <p className="text-xs font-medium text-red-600">{accessError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingUserId(null)}
                  disabled={isSavingAccess}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChannelAccess}
                  disabled={isSavingAccess}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingAccess ? 'Saving...' : 'Save Access Rules'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
