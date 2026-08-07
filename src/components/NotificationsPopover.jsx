import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, FileText, AlertCircle, Sparkles, X } from 'lucide-react';

export default function NotificationsPopover({ onOpenContent }) {
  const { notifications, unreadNotificationCount, markNotificationRead, clearAllNotifications } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        title="Notifications"
        id="notifications-bell-btn"
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
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
                    {unreadNotificationCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.contentId && onOpenContent) {
                        onOpenContent(n.contentId);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${
                      !n.read ? 'bg-indigo-50/50 font-normal' : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        {!n.read && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full inline-block" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-slate-600 line-clamp-2">{n.message}</p>
                    {n.contentId && (
                      <span className="inline-block mt-1 text-[10px] text-indigo-600 font-medium">
                        View item #{n.contentId} →
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
