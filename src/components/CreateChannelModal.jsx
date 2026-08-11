import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { createChannel } from '../services/channelService';
import { X, Tv, Plus } from 'lucide-react';

export default function CreateChannelModal({ onClose }) {
  const { addChannel } = useApp();

  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [category, setCategory] = useState('');
  const [contentType, setContentType] = useState('long');
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState('🔥');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      channelName: name.trim(),
      language,
      categoryNiche: category.trim(),
      contentType,
      channelAvatarEmoji: avatar
    };

    setFormError('');
    setIsSaving(true);

    try {
      const response = await createChannel(payload);
      const apiChannel = response?.channel || response?.data?.channel || response?.data || response;

      addChannel({
        ...apiChannel,
        id: apiChannel?.id || apiChannel?._id,
        name: apiChannel?.name || apiChannel?.channelName || payload.channelName,
        language: apiChannel?.language || payload.language,
        category: apiChannel?.category || apiChannel?.categoryNiche || payload.categoryNiche,
        contentType: apiChannel?.contentType || payload.contentType,
        avatar: apiChannel?.avatar || apiChannel?.channelAvatarEmoji || payload.channelAvatarEmoji
      });

      onClose();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Channel create nahi ho saka.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-800">
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Create New YouTube Channel</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-red-700 text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Channel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Revenge Stories, Gates Ranks"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="French">French</option>
                <option value="Italian">Italian</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category / Niche</label>
              <input
                type="text"
                required
                placeholder="Revenge Stories, Ranking..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
              >
                <option value="long">Long Content</option>
                <option value="short">Short Content</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Channel Avatar Emoji</label>
              <select
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-base"
              >
                <option value="🔥">🔥 Fire</option>
                <option value="🏆">🏆 Trophy</option>
                <option value="🤝">🤝 Kindness</option>
                <option value="🎬">🎬 Cinema</option>
                <option value="🚀">🚀 Tech</option>
                <option value="🎮">🎮 Gaming</option>
              </select>
            </div>
          </div>

          {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="w-4 h-4" />
              <span>{isSaving ? 'Creating...' : 'Create Channel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
