import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, Wrench, Users, MessageSquare,
  Settings, LogOut, Menu, X, Star, Globe
} from 'lucide-react';
import { useAuthStore } from '../../store/auth';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-dark-900 border-r border-white/5 w-64">
      <div className="p-5 border-b border-white/5">
        <img src="/images/sna-logo.png" alt="SNA" className="h-10 w-auto object-contain" />
        <p className="text-xs text-slate-500 mt-2">Admin Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-2">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5">
          <Globe className="w-4 h-4" /> View Website
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-dark-950">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0"><Sidebar /></div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10"><Sidebar /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-dark-900 border-b border-white/5">
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
