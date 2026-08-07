import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import LoginScreen from './components/LoginScreen';

function AppContent() {
  const { isAdmin, setCurrentUserId, users } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'channels' | 'content' | 'users' | 'activity' | 'settings'
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal states
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [showCreateContentModal, setShowCreateContentModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('ytms-current-user-id');
    if (storedUserId) {
      const match = users.find((user) => user.id === storedUserId);
      if (match) {
        setCurrentUserId(storedUserId);
        setIsAuthenticated(true);
      }
    }

    const path = location.pathname;

    if (path.startsWith('/channels')) {
      setActiveTab('channels');
    } else if (path.startsWith('/content')) {
      setActiveTab('content');
    } else if (path.startsWith('/users')) {
      setActiveTab('users');
    } else if (path.startsWith('/activity')) {
      setActiveTab('activity');
    } else if (path.startsWith('/settings')) {
      setActiveTab('settings');
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  const handleNavigateToContent = (channelId = 'all', status = 'all') => {
    setSelectedChannelFilter(channelId);
    setSelectedStatusFilter(status);
    setActiveTab('content');
    navigate('/content');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === 'dashboard') {
      navigate('/dashboard');
    } else if (tab === 'channels') {
      navigate('/channels');
    } else if (tab === 'content') {
      navigate('/content');
    } else if (tab === 'users') {
      navigate('/users');
    } else if (tab === 'activity') {
      navigate('/activity');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  const handleLogin = (userId) => {
    setCurrentUserId(userId);
    localStorage.setItem('ytms-current-user-id', userId);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased selection:bg-red-500 selection:text-white">
      <Header
        searchQuery={globalSearch}
        setSearchQuery={setGlobalSearch}
        onOpenCreateModal={() => setShowCreateContentModal(true)}
        onOpenContent={(id) => setSelectedContentId(id)}
      />

      <div className="flex-1 flex w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          selectedChannelFilter={selectedChannelFilter}
          setSelectedChannelFilter={setSelectedChannelFilter}
          selectedStatusFilter={selectedStatusFilter}
          setSelectedStatusFilter={setSelectedStatusFilter}
          onOpenCreateChannel={() => setShowCreateChannelModal(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  onNavigateToContent={handleNavigateToContent}
                  onNavigateToChannel={(chId) => {
                    setSelectedChannelFilter(chId);
                    setActiveTab('channels');
                    navigate('/channels');
                  }}
                  onOpenContent={(id) => setSelectedContentId(id)}
                />
              }
            />
            <Route
              path="/channels"
              element={
                <ChannelsView
                  onSelectChannelFilter={(chId) => {
                    setSelectedChannelFilter(chId);
                    setActiveTab('content');
                    navigate('/content');
                  }}
                  onOpenCreateChannel={() => setShowCreateChannelModal(true)}
                />
              }
            />
            <Route
              path="/content"
              element={
                <ContentManagementView
                  selectedChannelFilter={selectedChannelFilter}
                  setSelectedChannelFilter={setSelectedChannelFilter}
                  selectedStatusFilter={selectedStatusFilter}
                  setSelectedStatusFilter={setSelectedStatusFilter}
                  globalSearch={globalSearch}
                  onOpenCreateModal={() => setShowCreateContentModal(true)}
                  onOpenContentDetails={(id) => setSelectedContentId(id)}
                />
              }
            />
            <Route path="/users" element={<UserManagementView />} />
            <Route
              path="/activity"
              element={<ActivityHistoryView onOpenContentDetails={(id) => setSelectedContentId(id)} />}
            />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>

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

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
