import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, AlertCircle, Link, Save } from 'lucide-react';
import { checkSourceUrl } from '../services/contentService';

export default function CreateContentModal({ onClose, defaultChannelId, initialContent }) {
  const {
    contentOptionChannels,
    contentOptionUsers,
    loadContentOptions,
    addContentItem,
    updateContentRecord,
    currentUser
  } = useApp();

  const isEditMode = Boolean(initialContent?.id);
  const [channelId, setChannelId] = useState(initialContent?.channelId || defaultChannelId || contentOptionChannels[0]?.id || '');
  const [title, setTitle] = useState(initialContent?.title || '');
  const [sourceUrl, setSourceUrl] = useState(initialContent?.sourceUrl || '');
  const [sourceCreator, setSourceCreator] = useState(initialContent?.sourceCreator || '');
  const [contentType, setContentType] = useState(initialContent?.contentType || 'long');
  const [priority, setPriority] = useState(initialContent?.priority || 'Medium');
  const [status, setStatus] = useState(initialContent?.status || 'Pending');
  const [assignedUserId, setAssignedUserId] = useState(initialContent?.assignedUserId || currentUser.id);
  const [duplicateState, setDuplicateState] = useState({ checking: false, duplicate: false, message: '' });
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedChannel = useMemo(
    () => contentOptionChannels.find((ch) => ch.id === channelId),
    [contentOptionChannels, channelId]
  );
  const fieldsDisabled = duplicateState.duplicate || duplicateState.checking || isSaving;

  useEffect(() => {
    loadContentOptions().catch((err) => {
      setFormError(err.response?.data?.message || 'Content options load nahi ho sake.');
    });
  }, []);

  useEffect(() => {
    const nextChannelId = initialContent?.channelId || defaultChannelId || contentOptionChannels[0]?.id || '';
    if (!channelId && nextChannelId) {
      setChannelId(nextChannelId);
    }
  }, [contentOptionChannels, defaultChannelId, initialContent, channelId]);

  useEffect(() => {
    if (contentOptionUsers.length === 0) return;
    const hasSelectedUser = contentOptionUsers.some((user) => user.id === assignedUserId);

    if (!hasSelectedUser) {
      setAssignedUserId(contentOptionUsers[0].id);
    }
  }, [contentOptionUsers, assignedUserId]);

  useEffect(() => {
    if (selectedChannel?.contentType) {
      setContentType(selectedChannel.contentType);
    }
  }, [selectedChannel]);

  useEffect(() => {
    const cleanUrl = sourceUrl.trim();

    if (!cleanUrl || (isEditMode && cleanUrl === (initialContent?.sourceUrl || '').trim())) {
      setDuplicateState({ checking: false, duplicate: false, message: '' });
      return;
    }

    setDuplicateState({ checking: true, duplicate: false, message: 'Checking source URL...' });

    const timeoutId = setTimeout(async () => {
      try {
        const response = await checkSourceUrl(cleanUrl);
        setDuplicateState({
          checking: false,
          duplicate: Boolean(response?.duplicate),
          message: response?.message || ''
        });
      } catch (err) {
        setDuplicateState({
          checking: false,
          duplicate: true,
          message: err.response?.data?.message || 'Source URL verify nahi ho saka.'
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [sourceUrl, isEditMode, initialContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !channelId || duplicateState.duplicate) return;

    const payload = {
      channelId,
      videoTitle: title.trim(),
      sourceUrl: sourceUrl.trim(),
      sourceCreator: sourceCreator.trim(),
      contentType,
      priority,
      status,
      assignedUserId
    };

    setFormError('');
    setIsSaving(true);

    try {
      if (isEditMode) {
        await updateContentRecord(initialContent.id, payload);
      } else {
        await addContentItem(payload);
      }
      onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || (isEditMode ? 'Content update nahi ho saka.' : 'Content create nahi ho saka.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden text-slate-800 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Save className="w-5 h-5 text-red-500" />
            ) : (
              <Plus className="w-5 h-5 text-red-500" />
            )}
            <h3 className="font-bold text-base">
              {isEditMode ? 'Edit Content Record' : 'Create New Content Record'}
            </h3>
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
              disabled={isSaving}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
            >
              {contentOptionChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source URL */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Source URL (YouTube / Website)</label>
            <input
              type="url"
              placeholder="https://..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              disabled={isSaving}
              className={`w-full p-2.5 bg-slate-50 border rounded-lg ${
                duplicateState.duplicate
                  ? 'border-red-400 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500'
                  : 'border-slate-300'
              }`}
            />

            {duplicateState.message && (
              <div
                className={`mt-2 p-3 rounded-lg flex items-start gap-2 text-[11px] border ${
                  duplicateState.duplicate
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${duplicateState.duplicate ? 'text-red-600' : 'text-slate-500'}`} />
                <div>
                  <span className="font-bold">
                    {duplicateState.duplicate ? 'Duplicate Source URL:' : 'Source URL Check:'}
                  </span>{' '}
                  {duplicateState.message}
                </div>
              </div>
            )}
          </div>

          {/* Source Information & Duplicate Check */}
          <div className={`space-y-3 p-4 rounded-xl border ${
            fieldsDisabled
              ? 'bg-slate-100 border-slate-300 opacity-70'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-slate-500" />
              <span>Research / Source Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Entitled Boss Fired Me, So I Bought His Office"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={fieldsDisabled}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source Creator</label>
                <input
                  type="text"
                  placeholder="Creator or Reddit username"
                  value={sourceCreator}
                  onChange={(e) => setSourceCreator(e.target.value)}
                  disabled={fieldsDisabled}
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
                disabled
                className="w-full p-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-600"
              >
                <option value="long">Long Content</option>
                <option value="short">Short Content</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={fieldsDisabled}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {isEditMode ? 'Status' : 'Initial Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={fieldsDisabled}
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
              disabled={fieldsDisabled}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              {contentOptionUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={fieldsDisabled || !channelId}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>
                {isSaving
                  ? isEditMode ? 'Updating...' : 'Creating...'
                  : isEditMode ? 'Update Content' : 'Create Content'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
