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
import ContentDetailsModal from './components/ContentDetailsModal';
import CreateContentModal from './components/CreateContentModal';
import CreateChannelModal from './components/CreateChannelModal';
import LoginScreen from './components/LoginScreen';
import { logoutUser } from './services/authService';

function AppContent() {
  const {
    contentList,
    isAdmin,
    loadChannels,
    loadContentOptions,
    loadNotifications,
    setCurrentUserId,
    setLoggedInUser,
    users
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'channels' | 'content' | 'users' | 'activity'
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal states
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [showCreateContentModal, setShowCreateContentModal] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const editingContent = contentList.find((item) => item.id === editingContentId);

  useEffect(() => {
    const storedUserId = localStorage.getItem('ytms-current-user-id');
    const storedUser = localStorage.getItem('ytms-current-user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('ytms-current-user');
      }
    } else if (storedUserId) {
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
    } else {
      setActiveTab('dashboard');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;

    loadChannels().catch((err) => {
      console.error(err.response?.data?.message || 'Channels load nahi ho sake.');
    });
    loadContentOptions().catch((err) => {
      console.error(err.response?.data?.message || 'Content options load nahi ho sake.');
    });
    loadNotifications().catch((err) => {
      console.error(err.response?.data?.message || 'Notifications load nahi ho sake.');
    });
  }, [isAuthenticated]);

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
    }
  };

  const getLoginPayloadUser = (payload) => {
    const apiUser = payload?.user || payload?.data?.user || payload;
    const role = apiUser?.role || 'Admin';
    const userId = apiUser?.id || apiUser?._id || apiUser?.email || 'api-user';
    const matchedUser = users.find((user) => user.email === apiUser?.email);
    const assignedChannelIds = apiUser?.assignedChannelIds || apiUser?.assignedChannels || [];

    return {
      id: matchedUser?.id || userId,
      fullName: apiUser?.fullName || apiUser?.name || apiUser?.username || apiUser?.email || 'Admin',
      email: apiUser?.email || '',
      role: role.toLowerCase() === 'admin' ? 'Admin' : role,
      status: apiUser?.status || 'Active',
      assignedChannelIds: matchedUser?.assignedChannelIds || assignedChannelIds || [],
      lastLogin: 'Just now',
      avatarColor: matchedUser?.avatarColor || 'bg-purple-600'
    };
  };

  const handleLogin = (payload) => {
    const loginUser = getLoginPayloadUser(payload);
    const token = payload?.token || payload?.data?.token;

    setLoggedInUser(loginUser);
    localStorage.setItem('ytms-current-user-id', loginUser.id);
    localStorage.setItem('ytms-current-user', JSON.stringify(loginUser));

    if (token) {
      localStorage.setItem('ytms-auth-token', token);
    }

    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const clearSession = () => {
    localStorage.removeItem('ytms-auth-token');
    localStorage.removeItem('ytms-current-user-id');
    localStorage.removeItem('ytms-current-user');
    setIsAuthenticated(false);
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearSession();
    }
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
        onLogout={handleLogout}
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
                  onOpenEditContent={(id) => setEditingContentId(id)}
                />
              }
            />
            <Route path="/users" element={<UserManagementView />} />
            <Route
              path="/activity"
              element={<ActivityHistoryView onOpenContentDetails={(id) => setSelectedContentId(id)} />}
            />
          </Routes>
        </main>
      </div>

      {selectedContentId && (
        <ContentDetailsModal
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
        />
      )}

      {(showCreateContentModal || editingContent) && (
        <CreateContentModal
          onClose={() => {
            setShowCreateContentModal(false);
            setEditingContentId(null);
          }}
          defaultChannelId={selectedChannelFilter !== 'all' ? selectedChannelFilter : ''}
          initialContent={editingContent}
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
