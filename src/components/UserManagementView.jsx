import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  X
} from 'lucide-react';

export default function UserManagementView() {
  const {
    users,
    channels,
    addUser,
    updateUser,
    roles,
    isAdmin,
    currentUser
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Script Writer');
  const [status, setStatus] = useState('Active');
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);

  const handleOpenAdd = () => {
    setFullName('');
    setEmail('');
    setPassword('SecurePass123!');
    setRole('Script Writer');
    setStatus('Active');
    setSelectedChannelIds([channels[0]?.id || '']);
    setShowAddModal(true);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    addUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      status,
      assignedChannelIds: role === 'Admin' ? channels.map(c => c.id) : selectedChannelIds
    });

    setShowAddModal(false);
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
              {users.length} Users
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
              {users.map((u) => {
                const assignedChans = u.role === 'Admin'
                  ? channels
                  : channels.filter(c => (u.assignedChannelIds || []).includes(c.id));

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${u.avatarColor || 'bg-slate-600'} text-white rounded-lg text-xs font-bold flex items-center justify-center shrink-0`}>
                          {u.fullName.charAt(0)}
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
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setEditingUserId(u.id);
                            setSelectedChannelIds(u.assignedChannelIds || []);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          Manage Access
                        </button>
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
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="Script Writer">Script Writer</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Editor">Editor</option>
                    <option value="Uploader">Uploader</option>
                  </select>
                </div>
              </div>

              {/* Multi-Select Assigned Channels */}
              {role !== 'Admin' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Channel Access (Multi-Select)
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2 max-h-40 overflow-y-auto">
                    {channels.map((ch) => {
                      const isChecked = selectedChannelIds.includes(ch.id);
                      return (
                        <label
                          key={ch.id}
                          className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer select-none hover:bg-slate-100 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleChannelSelection(ch.id)}
                            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{ch.avatar}</span>
                          <span className="font-bold">{ch.name}</span>
                          <span className="text-slate-400 text-[10px]">({ch.category})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingUserId(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateUser(editingUserId, { assignedChannelIds: selectedChannelIds });
                    setEditingUserId(null);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Access Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
