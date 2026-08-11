import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NotificationsPopover from './NotificationsPopover';
import {
  Search,
  PlusCircle,
  UserCheck,
  ShieldCheck,
  Youtube,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  onOpenContent,
  onLogout
}) {
  const {
    currentUser,
    isAdmin,
    accessibleChannels,
    channels
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-sm">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-base leading-tight">
                YouTube Management System
              </h1>
              <span className="bg-red-100 text-red-700 font-semibold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                MVP
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span>Channel Access:</span>
              <span className="font-semibold text-slate-700">
                {accessibleChannels.length} / {channels.length} channels
              </span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search content by title, creator, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            id="global-search-input"
          />
        </div>

        <div className="flex items-center gap-3">
         

          <NotificationsPopover onOpenContent={onOpenContent} />

          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
              title="Account menu"
              id="user-account-menu"
            >
              <div
                className={`w-7 h-7 ${currentUser.avatarColor || 'bg-purple-600'} text-white rounded-md text-xs font-bold flex items-center justify-center`}
              >
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1">
                  {currentUser.fullName}
                  {isAdmin ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-slate-800">
                  <div className="p-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${currentUser.avatarColor || 'bg-purple-600'} text-white rounded-lg text-sm font-bold flex items-center justify-center`}
                      >
                        {currentUser.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate flex items-center gap-1">
                          {currentUser.fullName}
                          {isAdmin ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser.email || currentUser.role}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
