import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_USERS,
  INITIAL_ACTIVITIES,
  SYSTEM_ROLES
} from '../data/mockData';
import { getChannels } from '../services/channelService';
import {
  createContent,
  deleteContent,
  getCompletedContents,
  getContentOptions,
  getContents,
  updateContent
} from '../services/contentService';
import {
  acceptNotification as acceptNotificationRequest,
  getNotifications
} from '../services/notificationService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState("usr-1"); // Default Admin
  const [channels, setChannels] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [contentOptionChannels, setContentOptionChannels] = useState([]);
  const [contentOptionUsers, setContentOptionUsers] = useState([]);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);
  const [useExpandedWorkflow, setUseExpandedWorkflow] = useState(false);

  const setLoggedInUser = (loginUser) => {
    if (!loginUser?.id) return;

    setUsers(prev => {
      const existingUser = prev.find(user => user.id === loginUser.id || user.email === loginUser.email);

      if (existingUser) {
        return prev.map(user => (
          user.id === existingUser.id
            ? { ...user, ...loginUser, id: existingUser.id }
            : user
        ));
      }

      return [...prev, loginUser];
    });

    setCurrentUserId(loginUser.id);
  };

  // Active current user object
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const isAdmin = currentUser.role === "Admin";
  const hasAllChannelAccess = isAdmin || currentUser.allChannelAccess || currentUser.assignedChannelIds === null;

  // Accessible channels based on User Channel Access Rule
  const accessibleChannels = useMemo(() => {
    if (hasAllChannelAccess) return channels;
    const assigned = currentUser.assignedChannelIds || [];
    return channels.filter(ch => assigned.includes(ch.id));
  }, [channels, currentUser, hasAllChannelAccess]);

  const accessibleChannelIds = useMemo(() => {
    return accessibleChannels.map(ch => ch.id);
  }, [accessibleChannels]);

  // Accessible content items based on User Channel Access Rule
  const accessibleContent = useMemo(() => {
    return contentList.filter(item => {
      if (isAdmin) return true;
      return accessibleChannelIds.includes(item.channelId);
    });
  }, [contentList, accessibleChannelIds, isAdmin]);

  const unreadNotificationCount = notificationCount;

  const formatChannel = (channel) => ({
    id: channel?.id || channel?._id,
    name: channel?.name || channel?.channelName || 'Untitled Channel',
    language: channel?.language || 'English',
    category: channel?.category || channel?.categoryNiche || '',
    contentType: channel?.contentType || 'long',
    createdBy: channel?.createdBy || null,
    createdAt: channel?.createdAt || null,
    updatedAt: channel?.updatedAt || null,
    description: channel?.description || 'YouTube Channel',
    subscribers: channel?.subscribers || '0',
    status: channel?.status || 'Active',
    color: channel?.color || 'bg-indigo-500',
    avatar: channel?.avatar || channel?.channelAvatarEmoji || 'ðŸ“º'
  });

  const loadChannels = async () => {
    const response = await getChannels();
    const channelsList = response?.channels || response?.data?.channels || response?.data || response;

    setChannels(Array.isArray(channelsList) ? channelsList.map(formatChannel) : []);
    return channelsList;
  };

  const formatContentOptionChannel = (channel) => ({
    id: channel?.id || channel?._id,
    label: channel?.label || `${channel?.channelAvatarEmoji || ''} ${channel?.channelName || channel?.name || 'Untitled Channel'}`,
    name: channel?.channelName || channel?.name || 'Untitled Channel',
    category: channel?.categoryNiche || channel?.category || '',
    avatar: channel?.channelAvatarEmoji || channel?.avatar || '',
    contentType: channel?.contentType || 'long'
  });

  const formatContentOptionUser = (user) => ({
    id: user?.id || user?._id,
    label: user?.label || `${user?.fullName || user?.name || user?.email || 'User'} (${user?.role || 'user'})`,
    fullName: user?.fullName || user?.name || user?.email || 'User',
    email: user?.email || '',
    role: user?.role || 'user'
  });

  const formatContentItem = (item) => {
    const channel = item?.channel || item?.youtubeChannel || item?.channelId;
    const assignedUser = item?.assignedUser || item?.assignedTo || item?.assignedUserId;
    const channelId = typeof channel === 'object' ? channel?.id || channel?._id : channel;
    const assignedUserId = typeof assignedUser === 'object' ? assignedUser?.id || assignedUser?._id : assignedUser;

    return {
      id: item?.id || item?._id,
      channelId,
      title: item?.title || item?.videoTitle || item?.workingTitle || 'Untitled Content',
      sourceUrl: item?.sourceUrl || '',
      sourceTitle: item?.sourceTitle || '',
      sourceCreator: item?.sourceCreator || '',
      status: item?.status || 'Pending',
      workflowStage: item?.workflowStage || 'Research',
      priority: item?.priority || 'Medium',
      contentType: item?.contentType || 'long',
      type: item?.type || item?.contentType || 'long', // Keep original API field
      assignedUserId,
      assignedUser: typeof assignedUser === 'object' ? formatContentOptionUser(assignedUser) : null,
      assignedTo: typeof assignedUser === 'object' ? assignedUser : null, // Keep original API field
      channel: typeof channel === 'object' ? channel : null, // Keep full channel object
      createdDate: item?.createdDate || item?.createdAt?.split?.('T')?.[0] || '',
      updatedDate: item?.updatedDate || item?.updatedAt?.split?.('T')?.[0] || '',
      createdAt: item?.createdAt || '', // Keep original API field
      updatedAt: item?.updatedAt || '', // Keep original API field
      completedStage: item?.completedStage || '',
      completedAt: item?.completedAt || '',
      completedBy: item?.completedBy || null
    };
  };

  const formatNotification = (notification) => {
    const content = notification?.content || {};

    return {
      id: notification?.id || notification?._id,
      content,
      contentId: content?.id || content?._id || notification?.contentId,
      fromUser: notification?.fromUser || null,
      targetRole: notification?.targetRole || '',
      status: notification?.status || 'pending',
      message: notification?.message || 'New work assigned',
      createdAt: notification?.createdAt || '',
      title: content?.title || content?.videoTitle || content?.workingTitle || 'New content work',
      read: notification?.status && notification.status !== 'pending',
      time: notification?.createdAt
        ? new Date(notification.createdAt).toLocaleString()
        : ''
    };
  };

  const loadContentOptions = async () => {
    const response = await getContentOptions();
    const optionChannels = response?.channels || response?.data?.channels || [];
    const optionUsers = response?.users || response?.data?.users || [];

    setContentOptionChannels(optionChannels.map(formatContentOptionChannel));
    setContentOptionUsers(optionUsers.map(formatContentOptionUser));
    return response;
  };

  const loadContentItems = async (filters = {}) => {
    const isCompletedTab = filters?.status === 'Completed';
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value && value !== 'all')
    );

    if (isCompletedTab) {
      delete cleanedFilters.status;
      if (cleanedFilters.assignedUser) {
        cleanedFilters.completedBy = cleanedFilters.assignedUser;
        delete cleanedFilters.assignedUser;
      }
    }

    const response = isCompletedTab
      ? await getCompletedContents(cleanedFilters)
      : await getContents(cleanedFilters);
    const items = response?.contents || response?.content || response?.data?.contents || response?.data || response;
    const count = response?.count ?? response?.data?.count ?? (Array.isArray(items) ? items.length : 0);

    setContentList(Array.isArray(items) ? items.map(formatContentItem) : []);
    setContentCount(Number.isFinite(Number(count)) ? Number(count) : 0);
    return items;
  };

  const loadNotifications = async () => {
    const response = await getNotifications();
    const list = response?.notifications || response?.data?.notifications || [];
    const count = response?.count ?? response?.data?.count ?? list.length;

    setNotifications(Array.isArray(list) ? list.map(formatNotification) : []);
    setNotificationCount(Number.isFinite(Number(count)) ? Number(count) : 0);
    return response;
  };

  const acceptNotification = async (notificationId) => {
    const response = await acceptNotificationRequest(notificationId);
    return response;
  };

  // Helper to log activities
  const logActivity = (contentId, contentTitle, action, previousStatus, newStatus, note = "") => {
    const newAct = {
      id: `act-${Date.now()}`,
      contentId,
      contentTitle,
      user: currentUser.fullName,
      action,
      previousStatus: previousStatus || "N/A",
      newStatus: newStatus || "N/A",
      dateTime: new Date().toLocaleString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      note
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Helper to dispatch notifications
  const addNotification = (targetUserId, title, message, contentId = null) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title,
      message,
      time: "Just now",
      read: false,
      contentId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addContentItem = async (newItem) => {
    const response = await createContent(newItem);
    const apiItem = response?.content || response?.data?.content || response?.data || response;
    const fullItem = formatContentItem(apiItem);

    setContentList(prev => [fullItem, ...prev]);
    return fullItem.id;
  };

  const updateContentRecord = async (id, updatedFields) => {
    const response = await updateContent(id, updatedFields);
    const apiItem = response?.content || response?.data?.content || response?.data || response;
    const formattedItem = formatContentItem({
      ...updatedFields,
      ...apiItem,
      id: apiItem?.id || apiItem?._id || id
    });

    setContentList(prev => prev.map(item => (
      item.id === id
        ? { ...item, ...formattedItem, updatedDate: formattedItem.updatedDate || new Date().toISOString().split('T')[0] }
        : item
    )));

    return formattedItem;
  };

  const deleteContentItem = async (id) => {
    await deleteContent(id);
    setContentList(prev => prev.filter(item => item.id !== id));
  };

  // Update Content Item
  const updateContentItem = (id, updatedFields, note = "") => {
    setContentList(prev => prev.map(item => {
      if (item.id === id) {
        const prevStatus = item.status;
        const newStatus = updatedFields.status || item.status;
        const updated = {
          ...item,
          ...updatedFields,
          updatedDate: new Date().toISOString().split('T')[0]
        };

        if (prevStatus !== newStatus) {
          logActivity(
            id,
            updated.title,
            "Status Changed",
            prevStatus,
            newStatus,
            note || `Status updated from ${prevStatus} to ${newStatus}`
          );

          // Notify assigned user or uploader if status becomes Completed
          if (updated.assignedUserId && updated.assignedUserId !== currentUser.id) {
            addNotification(
              updated.assignedUserId,
              "Content Status Changed",
              `'${updated.title}' changed status: ${prevStatus} → ${newStatus}`,
              id
            );
          }
        }

        return updated;
      }
      return item;
    }));
  };

  // Channel Management
  const addChannel = (newChan) => {
    const id = newChan.id || `chn-${channels.length + 1}`;
    const channelObj = {
      id,
      name: newChan.name,
      language: newChan.language,
      category: newChan.category,
      contentType: newChan.contentType || "long",
      description: newChan.description || "YouTube Channel",
      subscribers: newChan.subscribers || "0",
      status: "Active",
      color: newChan.color || "bg-indigo-500",
      avatar: newChan.avatar || "📺"
    };
    setChannels(prev => [...prev, channelObj]);
    // Automatically assign admin to new channel
    setUsers(prev => prev.map(u => {
      if (u.allChannelAccess || u.assignedChannelIds === null) {
        return u;
      }

      if (u.role === 'Admin') {
        return { ...u, assignedChannelIds: [...new Set([...u.assignedChannelIds, id])] };
      }
      return u;
    }));
    return id;
  };

  // User Management
  const addUser = (newUser) => {
    const id = newUser.id || `usr-${users.length + 1}`;
    const colors = ["bg-purple-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-teal-600"];
    const userObj = {
      id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status || "Active",
      assignedChannelIds: newUser.assignedChannelIds ?? [],
      allChannelAccess: Boolean(newUser.allChannelAccess || newUser.assignedChannelIds === null),
      lastLogin: "Never",
      avatarColor: colors[users.length % colors.length]
    };
    setUsers(prev => [...prev, userObj]);
    return id;
  };

  const updateUser = (id, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const value = {
    users,
    currentUserId,
    setCurrentUserId,
    setLoggedInUser,
    currentUser,
    isAdmin,
    hasAllChannelAccess,
    channels,
    accessibleChannels,
    contentList,
    contentCount,
    accessibleContent,
    contentOptionChannels,
    contentOptionUsers,
    activities,
    notifications,
    unreadNotificationCount,
    roles: SYSTEM_ROLES,
    useExpandedWorkflow,
    setUseExpandedWorkflow,
    loadChannels,
    loadContentOptions,
    loadContentItems,
    loadNotifications,
    acceptNotification,
    addContentItem,
    updateContentRecord,
    deleteContentItem,
    updateContentItem,
    addChannel,
    addUser,
    updateUser,
    deleteUser,
    logActivity
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
