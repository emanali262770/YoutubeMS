import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import NotificationsPopover from './NotificationsPopover';
import {
  Search,
  PlusCircle,
  UserCheck,
  ShieldCheck,
  Youtube,
  Tv,
  ChevronDown,
  Lock,
  Layers
} from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  onOpenContent
}) {
  const {
    currentUser,
    users,
    setCurrentUserId,
    isAdmin,
    accessibleChannels,
    channels
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Brand Title */}
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

        {/* Search Bar */}
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

        {/* Right Actions & User Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Add Content */}
          <button
            onClick={onOpenCreateModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
            id="add-content-header-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Content</span>
          </button>

          {/* Notifications */}
          <NotificationsPopover onOpenContent={onOpenContent} />

          {/* Active User Switcher (For live testing Admin & Normal User roles) */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-left transition-colors cursor-pointer"
              title="Switch user role perspective"
              id="user-perspective-switcher"
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
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Switch User Perspective
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Select a profile to test channel access rules & role permissions.
                    </p>
                  </div>

                  <div className="space-y-1">
                    {users.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      const userChansCount = user.role === 'Admin'
                        ? channels.length
                        : (user.assignedChannelIds || []).length;

                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUserId(user.id);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 text-red-900 font-semibold border border-red-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 ${user.avatarColor || 'bg-slate-600'} text-white rounded-md text-[10px] font-bold flex items-center justify-center`}
                            >
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 flex items-center gap-1">
                                {user.fullName}
                                {user.role === 'Admin' && (
                                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-semibold">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {user.role} • {userChansCount} channels
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                          )}
                        </button>
                      );
                    })}
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
