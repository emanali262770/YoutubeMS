import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChannelsView from './components/ChannelsView';
import ContentManagementView from './components/ContentManagementView';
import UserManagementView from './components/UserManagementView';
import ActivityHistoryView from './components/ActivityHistoryView';
import SettingsView from './components/SettingsView';
import ContentDetailsModal from './components/ContentDetailsModal';
import CreateContentModal from './components/CreateContentModal';
import CreateChannelModal from './components/CreateChannelModal';

function AppContent() {
  const { isAdmin } = useApp();

  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'channels' | 'content' | 'users' | 'activity' | 'settings'
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal states
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [showCreateContentModal, setShowCreateContentModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  // Helper navigation routines
  const handleNavigateToContent = (channelId = 'all', status = 'all') => {
    setSelectedChannelFilter(channelId);
    setSelectedStatusFilter(status);
    setActiveTab('content');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header
        searchQuery={globalSearch}
        setSearchQuery={setGlobalSearch}
        onOpenCreateModal={() => setShowCreateContentModal(true)}
        onOpenContent={(id) => setSelectedContentId(id)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedChannelFilter={selectedChannelFilter}
          setSelectedChannelFilter={setSelectedChannelFilter}
          selectedStatusFilter={selectedStatusFilter}
          setSelectedStatusFilter={setSelectedStatusFilter}
          onOpenCreateChannel={() => setShowCreateChannelModal(true)}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigateToContent={handleNavigateToContent}
              onNavigateToChannel={(chId) => {
                setSelectedChannelFilter(chId);
                setActiveTab('channels');
              }}
              onOpenContent={(id) => setSelectedContentId(id)}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelsView
              onSelectChannelFilter={(chId) => {
                setSelectedChannelFilter(chId);
                setActiveTab('content');
              }}
              onOpenCreateChannel={() => setShowCreateChannelModal(true)}
            />
          )}

          {activeTab === 'content' && (
            <ContentManagementView
              selectedChannelFilter={selectedChannelFilter}
              setSelectedChannelFilter={setSelectedChannelFilter}
              selectedStatusFilter={selectedStatusFilter}
              setSelectedStatusFilter={setSelectedStatusFilter}
              globalSearch={globalSearch}
              onOpenCreateModal={() => setShowCreateContentModal(true)}
              onOpenContentDetails={(id) => setSelectedContentId(id)}
            />
          )}

          {activeTab === 'users' && <UserManagementView />}

          {activeTab === 'activity' && (
            <ActivityHistoryView
              onOpenContentDetails={(id) => setSelectedContentId(id)}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      {selectedContentId && (
        <ContentDetailsModal
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
        />
      )}

      {showCreateContentModal && (
        <CreateContentModal
          onClose={() => setShowCreateContentModal(false)}
          defaultChannelId={selectedChannelFilter !== 'all' ? selectedChannelFilter : ''}
        />
      )}

      {showCreateChannelModal && isAdmin && (
        <CreateChannelModal
          onClose={() => setShowCreateChannelModal(false)}
        />
      )}
    </div>
  );
}

export default AppContent;
