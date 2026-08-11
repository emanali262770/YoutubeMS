import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, FileText, X } from 'lucide-react';

export default function NotificationsPopover({ onOpenContent }) {
  const {
    notifications,
    unreadNotificationCount,
    acceptNotification,
    loadContentItems,
    loadNotifications
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications().catch(() => {
      setError('Notifications load nahi ho sake.');
    });
  }, []);

  const openPopover = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    setError('');

    if (nextOpen) {
      setIsLoading(true);
      loadNotifications()
        .catch((err) => {
          setError(err.response?.data?.message || 'Notifications load nahi ho sake.');
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleAccept = async (notificationId) => {
    setAcceptingId(notificationId);
    setError('');

    try {
      const response = await acceptNotification(notificationId);

      if (response?.success === false) {
        setError(response.message || 'This work has already been accepted by another user');
      }

      await loadNotifications();
      await loadContentItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Work accept nahi ho saka.');
      await loadNotifications().catch(() => {});
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={openPopover}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        title="Notifications"
        id="notifications-bell-btn"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-slate-800">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-rose-600" />
                <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                {unreadNotificationCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadNotificationCount} pending
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {error && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border-b border-red-100 font-medium">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No pending notifications.
                </div>
              ) : (
                notifications.map((notification) => {
                  const channel = notification.content?.channel || {};

                  return (
                    <div
                      key={notification.id}
                      className="p-3 text-xs transition-colors hover:bg-slate-50 bg-rose-50/30"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (notification.contentId && onOpenContent) {
                              onOpenContent(notification.contentId);
                              setIsOpen(false);
                            }
                          }}
                          className="min-w-0 text-left font-semibold text-slate-900 flex items-center gap-1 hover:text-red-600"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span className="truncate">{notification.title}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-slate-600 line-clamp-2">{notification.message}</p>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="min-w-0 text-[10px] text-slate-500">
                          <div className="truncate font-medium text-slate-700">
                            {(channel.avatarEmoji || channel.avatar || '')} {channel.name || 'Channel'}
                          </div>
                          <div className="truncate">
                            From {notification.fromUser?.fullName || 'User'} to {notification.targetRole || 'role'}
                          </div>
                        </div>

                        {notification.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleAccept(notification.id)}
                            disabled={acceptingId === notification.id}
                            className="shrink-0 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{acceptingId === notification.id ? 'Accepting...' : 'Accept'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
