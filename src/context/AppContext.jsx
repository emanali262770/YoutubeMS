import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_CHANNELS,
  INITIAL_USERS,
  INITIAL_CONTENT,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  SYSTEM_ROLES
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState("usr-1"); // Default Admin
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [contentList, setContentList] = useState(INITIAL_CONTENT);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [useExpandedWorkflow, setUseExpandedWorkflow] = useState(false);

  // Active current user object
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const isAdmin = currentUser.role === "Admin";

  // Accessible channels based on User Channel Access Rule
  const accessibleChannels = useMemo(() => {
    if (isAdmin) return channels;
    const assigned = currentUser.assignedChannelIds || [];
    return channels.filter(ch => assigned.includes(ch.id));
  }, [channels, currentUser, isAdmin]);

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

  // User specific notifications
  const userNotifications = useMemo(() => {
    return notifications.filter(n => n.userId === currentUser.id || isAdmin);
  }, [notifications, currentUser.id, isAdmin]);

  const unreadNotificationCount = useMemo(() => {
    return userNotifications.filter(n => !n.read).length;
  }, [userNotifications]);

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

  // Add Content Item with duplicate check
  const addContentItem = (newItem) => {
    const contentId = `CNT-${String(contentList.length + 1).padStart(5, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const fullItem = {
      id: contentId,
      channelId: newItem.channelId,
      title: newItem.title,
      sourceUrl: newItem.sourceUrl || "",
      sourceTitle: newItem.sourceTitle || "",
      sourceCreator: newItem.sourceCreator || "",
      status: newItem.status || "Pending",
      workflowStage: newItem.workflowStage || "Research",
      priority: newItem.priority || "Medium",
      contentType: newItem.contentType || "Longform",
      assignedUserId: newItem.assignedUserId || currentUser.id,
      researchNotes: newItem.researchNotes || "",
      scriptWriterId: newItem.scriptWriterId || (currentUser.role === 'Script Writer' ? currentUser.id : null),
      scriptNotes: newItem.scriptNotes || "",
      editorUserId: newItem.editorUserId || (currentUser.role === 'Editor' ? currentUser.id : null),
      editingStatus: newItem.editingStatus || "Not Started",
      videoTitle: newItem.videoTitle || "",
      uploaderUserId: newItem.uploaderUserId || (currentUser.role === 'Uploader' ? currentUser.id : null),
      uploadStatus: newItem.uploadStatus || "Pending",
      finalTitle: newItem.finalTitle || "",
      publishedDate: null,
      createdDate: today,
      updatedDate: today
    };

    setContentList(prev => [fullItem, ...prev]);
    logActivity(
      contentId,
      fullItem.title,
      "Content Created",
      "None",
      fullItem.status,
      `Created for channel: ${channels.find(c => c.id === newItem.channelId)?.name || ''}`
    );

    if (fullItem.assignedUserId && fullItem.assignedUserId !== currentUser.id) {
      addNotification(
        fullItem.assignedUserId,
        "New content assigned to you",
        `${currentUser.fullName} assigned you to '${fullItem.title}'`,
        contentId
      );
    }

    return contentId;
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

  // Check duplicate URL
  const checkDuplicateUrl = (url) => {
    if (!url || !url.trim()) return null;
    const clean = url.trim().toLowerCase();
    return contentList.find(c => c.sourceUrl && c.sourceUrl.trim().toLowerCase() === clean);
  };

  // Channel Management
  const addChannel = (newChan) => {
    const id = `chn-${channels.length + 1}`;
    const channelObj = {
      id,
      name: newChan.name,
      language: newChan.language,
      category: newChan.category,
      description: newChan.description || "YouTube Channel",
      subscribers: newChan.subscribers || "0",
      status: "Active",
      color: newChan.color || "bg-indigo-500",
      avatar: newChan.avatar || "📺"
    };
    setChannels(prev => [...prev, channelObj]);
    // Automatically assign admin to new channel
    setUsers(prev => prev.map(u => {
      if (u.role === 'Admin') {
        return { ...u, assignedChannelIds: [...new Set([...u.assignedChannelIds, id])] };
      }
      return u;
    }));
    return id;
  };

  // User Management
  const addUser = (newUser) => {
    const id = `usr-${users.length + 1}`;
    const colors = ["bg-purple-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-teal-600"];
    const userObj = {
      id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status || "Active",
      assignedChannelIds: newUser.assignedChannelIds || [],
      lastLogin: "Never",
      avatarColor: colors[users.length % colors.length]
    };
    setUsers(prev => [...prev, userObj]);
    return id;
  };

  const updateUser = (id, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  const value = {
    users,
    currentUserId,
    setCurrentUserId,
    currentUser,
    isAdmin,
    channels,
    accessibleChannels,
    contentList,
    accessibleContent,
    activities,
    notifications: userNotifications,
    unreadNotificationCount,
    roles: SYSTEM_ROLES,
    useExpandedWorkflow,
    setUseExpandedWorkflow,
    addContentItem,
    updateContentItem,
    checkDuplicateUrl,
    addChannel,
    addUser,
    updateUser,
    logActivity,
    markNotificationRead,
    clearAllNotifications
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
