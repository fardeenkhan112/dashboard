import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ShieldCheck,
  Package,
  Tags,
  Sun,
  Moon,
} from '../components/Icon.jsx';

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const go = (page) => {
    onNavigate(page);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b app-topbar backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
          className="icon-button lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="relative max-w-[620px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go('products')}
              placeholder="Search products by name or description..."
              aria-label="Search products"
              className="control-input h-11 w-full pl-10 pr-4"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="icon-button"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={() => go('add-product')}
            className="hidden primary-button md:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>

          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
              className="icon-button relative"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="notification-dot" />
            </button>

            {notificationsOpen && (
              <div className="popover right-0 w-80">
                <div className="flex items-center justify-between border-b panel-divider pb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Workspace activity</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">Quick access to catalog tools</p>
                  </div>
                  <span className="status-chip status-purple">LIVE</span>
                </div>
                <button onClick={() => go('products')} className="popover-item mt-2">
                  <Package className="h-4 w-4 text-[#6d4cc2]" />
                  <span>Review product inventory</span>
                </button>
                <button onClick={() => go('categories')} className="popover-item">
                  <Tags className="h-4 w-4 text-sky-500" />
                  <span>Manage catalog categories</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="profile-button"
            >
              <span className="profile-avatar">AD</span>
              <span className="hidden text-left lg:block">
                <span className="block text-xs font-bold leading-tight text-slate-800">Administrator</span>
                <span className="mt-0.5 block text-[10px] text-slate-400">Catalog Manager</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="popover right-0 w-56">
                <div className="border-b panel-divider px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-900">Berry Administrator</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Admin workspace</p>
                </div>
                <button onClick={() => go('products')} className="popover-item mt-1">
                  <ShieldCheck className="h-4 w-4 text-[#6d4cc2]" />
                  <span>Manage Products</span>
                </button>
                <button onClick={() => go('categories')} className="popover-item">
                  <Tags className="h-4 w-4 text-sky-500" />
                  <span>Manage Categories</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
