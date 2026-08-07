import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  Link,
  User,
  Edit,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  History,
  Save,
  Tv,
  Tag,
  ExternalLink
} from 'lucide-react';

export default function ContentDetailsModal({ contentId, onClose }) {
  const {
    contentList,
    channels,
    users,
    activities,
    updateContentItem,
    currentUser
  } = useApp();

  const item = contentList.find((c) => c.id === contentId);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'research' | 'editing' | 'upload' | 'history'

  if (!item) return null;

  const channel = channels.find((c) => c.id === item.channelId);
  const assignedUser = users.find((u) => u.id === item.assignedUserId);
  const scriptWriter = users.find((u) => u.id === item.scriptWriterId);
  const editorUser = users.find((u) => u.id === item.editorUserId);
  const uploaderUser = users.find((u) => u.id === item.uploaderUserId);

  // History for this specific item
  const itemActivities = activities.filter((a) => a.contentId === item.id);

  // Local edit states for inline saving
  const [formState, setFormState] = useState({
    title: item.title,
    status: item.status,
    priority: item.priority,
    assignedUserId: item.assignedUserId || '',
    sourceUrl: item.sourceUrl || '',
    sourceTitle: item.sourceTitle || '',
    sourceCreator: item.sourceCreator || '',
    researchNotes: item.researchNotes || '',
    scriptNotes: item.scriptNotes || '',
    editorUserId: item.editorUserId || '',
    editingStatus: item.editingStatus || 'Not Started',
    videoTitle: item.videoTitle || '',
    uploaderUserId: item.uploaderUserId || '',
    uploadStatus: item.uploadStatus || 'Pending',
    finalTitle: item.finalTitle || '',
    publishedDate: item.publishedDate || ''
  });

  const handleSave = (note = 'Updated content details') => {
    updateContentItem(item.id, formState, note);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden text-slate-800 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-red-400 font-bold">
                {item.id}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <span>{channel?.avatar}</span>
                <span>{channel?.name}</span>
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
            onClick={() => setActiveTab('research')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'research'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>Research & Source</span>
          </button>

          <button
            onClick={() => setActiveTab('editing')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'editing'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Editing Info</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-red-600 text-red-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Info</span>
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
            <span>Activity History ({itemActivities.length})</span>
          </button>
        </div>

        {/* Modal Tab Contents */}
        <div className="p-6 text-xs max-h-[60vh] overflow-y-auto space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-700">Working Title</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formState.status}
                      onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Priority</label>
                    <select
                      value={formState.priority}
                      onChange={(e) => setFormState({ ...formState, priority: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Primary User</label>
                  <select
                    value={formState.assignedUserId}
                    onChange={(e) => setFormState({ ...formState, assignedUserId: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <div>Created Date: <span className="font-semibold text-slate-700">{item.createdDate}</span></div>
                  <div>Last Updated: <span className="font-semibold text-slate-700">{item.updatedDate}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESEARCH & SOURCE INFORMATION */}
          {activeTab === 'research' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source URL (Required)</label>
                  <input
                    type="url"
                    value={formState.sourceUrl}
                    onChange={(e) => setFormState({ ...formState, sourceUrl: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="https://..."
                  />
                  {formState.sourceUrl && (
                    <a
                      href={formState.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline mt-1 font-medium"
                    >
                      <span>Open Source Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Creator</label>
                  <input
                    type="text"
                    value={formState.sourceCreator}
                    onChange={(e) => setFormState({ ...formState, sourceCreator: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                    placeholder="Original Creator or Reddit User"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Title</label>
                <input
                  type="text"
                  value={formState.sourceTitle}
                  onChange={(e) => setFormState({ ...formState, sourceTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="Original title from source site"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Script Notes / Voice Directions</label>
                <textarea
                  rows="3"
                  value={formState.scriptNotes}
                  onChange={(e) => setFormState({ ...formState, scriptNotes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="Key story arcs, dialogue notes, narrative twists..."
                />
              </div>
            </div>
          )}

          {/* TAB 3: EDITING INFORMATION */}
          {activeTab === 'editing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Editor</label>
                  <select
                    value={formState.editorUserId}
                    onChange={(e) => setFormState({ ...formState, editorUserId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Editing Status</label>
                  <select
                    value={formState.editingStatus}
                    onChange={(e) => setFormState({ ...formState, editingStatus: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-xs"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Draft Video Title</label>
                <input
                  type="text"
                  value={formState.videoTitle}
                  onChange={(e) => setFormState({ ...formState, videoTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  placeholder="Draft video title for thumbnail & render"
                />
              </div>
            </div>
          )}

          {/* TAB 4: UPLOAD INFORMATION */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Uploader</label>
                  <select
                    value={formState.uploaderUserId}
                    onChange={(e) => setFormState({ ...formState, uploaderUserId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Status</label>
                  <select
                    value={formState.uploadStatus}
                    onChange={(e) => setFormState({ ...formState, uploadStatus: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Uploaded">Uploaded</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Final Published Title</label>
                <input
                  type="text"
                  value={formState.finalTitle}
                  onChange={(e) => setFormState({ ...formState, finalTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                  placeholder="Official YouTube published title"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Published Date/Time</label>
                <input
                  type="text"
                  value={formState.publishedDate}
                  onChange={(e) => setFormState({ ...formState, publishedDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  placeholder="e.g. 2026-08-07 14:00"
                />
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY HISTORY LOG */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Audit Trail for #{item.id}
              </div>

              {itemActivities.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No activity logged for this item yet.
                </div>
              ) : (
                itemActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-bold text-slate-900">{act.user}</span>
                      <span>{act.dateTime}</span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {act.action}: <span className="text-slate-500">{act.previousStatus}</span> →{' '}
                      <span className="text-indigo-600 font-bold">{act.newStatus}</span>
                    </div>
                    {act.note && (
                      <p className="text-[11px] text-slate-600 italic">"{act.note}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Role: <span className="font-semibold text-slate-700">{currentUser.role}</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
