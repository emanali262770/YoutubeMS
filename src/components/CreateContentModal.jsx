import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, AlertCircle, Sparkles, Link, CheckCircle2 } from 'lucide-react';

export default function CreateContentModal({ onClose, defaultChannelId }) {
  const {
    accessibleChannels,
    users,
    addContentItem,
    checkDuplicateUrl,
    currentUser
  } = useApp();

  const [channelId, setChannelId] = useState(defaultChannelId || accessibleChannels[0]?.id || '');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceCreator, setSourceCreator] = useState('');
  const [contentType, setContentType] = useState('Longform');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [assignedUserId, setAssignedUserId] = useState(currentUser.id);
  const [researchNotes, setResearchNotes] = useState('');

  // Check duplicate URL on input change
  const duplicateMatch = checkDuplicateUrl(sourceUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !channelId) return;

    addContentItem({
      channelId,
      title: title.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceTitle: sourceTitle.trim(),
      sourceCreator: sourceCreator.trim(),
      contentType,
      priority,
      status,
      assignedUserId,
      researchNotes: researchNotes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden text-slate-800 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base">Create New Content Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Channel Select */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              YouTube Channel <span className="text-red-500">*</span>
            </label>
            <select
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            >
              {accessibleChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.avatar} {ch.name} ({ch.category})
                </option>
              ))}
            </select>
          </div>

          {/* Working Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Working Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Entitled Boss Fired Me, So I Bought His Office"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900"
            />
          </div>

          {/* Source Information & Duplicate Check */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-slate-500" />
              <span>Research / Source Information</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Source URL (YouTube / Website)</label>
              <input
                type="url"
                placeholder="https://..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />

              {/* Duplicate Notice */}
              {duplicateMatch && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2 text-amber-900 text-[11px]">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Duplicate Source Warning:</span> This URL is already registered in{' '}
                    <span className="font-semibold text-amber-950">
                      #{duplicateMatch.id} - "{duplicateMatch.title}"
                    </span>.
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Title</label>
                <input
                  type="text"
                  placeholder="Original title from source"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Creator</label>
                <input
                  type="text"
                  placeholder="Creator or Reddit username"
                  value={sourceCreator}
                  onChange={(e) => setSourceCreator(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Content Config Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Longform">Longform Video</option>
                <option value="Shorts">YouTube Shorts</option>
                <option value="Compilation">Compilation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Assign User */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign User</label>
            <select
              value={assignedUserId}
              onChange={(e) => setAssignedUserId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Content</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
