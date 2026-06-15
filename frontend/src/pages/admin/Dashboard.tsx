import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Wrench, Users, MessageSquare, Star, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Project, Message } from '../../types';

export function Dashboard() {
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['projects'], queryFn: () => api.get('/projects').then(r => r.data) });
  const { data: messages = [] } = useQuery<Message[]>({ queryKey: ['admin-messages'], queryFn: () => api.get('/messages').then(r => r.data) });
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) });
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: () => api.get('/team').then(r => r.data) });

  const unreadCount = messages.filter((m: Message) => !m.read).length;
  const ongoingCount = projects.filter((p) => p.status === 'ongoing').length;
  const featuredCount = projects.filter((p) => p.featured).length;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen, color: 'text-brand-400', bg: 'bg-brand-500/10', link: '/admin/projects' },
    { label: 'Active Services', value: services.length, icon: Wrench, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/admin/services' },
    { label: 'Team Members', value: team.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', link: '/admin/team' },
    { label: 'New Messages', value: unreadCount, icon: MessageSquare, color: 'text-gold-400', bg: 'bg-gold-500/10', link: '/admin/messages', badge: unreadCount > 0 },
    { label: 'Ongoing Projects', value: ongoingCount, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10', link: '/admin/projects' },
    { label: 'Featured Projects', value: featuredCount, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', link: '/admin/projects' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back. Here's an overview of your website.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.link} className="card p-5 hover:border-brand-500/30 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Recent Projects</h2>
            <Link to="/admin/projects" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.location} · {p.year}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'ongoing' ? 'bg-gold-500/20 text-gold-400' : p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {p.status}
                </span>
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No projects yet. <Link to="/admin/projects" className="text-brand-400">Add one →</Link></p>}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white flex items-center gap-2">
              Recent Messages
              {unreadCount > 0 && <span className="bg-gold-500 text-dark-950 text-xs font-bold rounded-full px-2 py-0.5">{unreadCount}</span>}
            </h2>
            <Link to="/admin/messages" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m.id} className={`flex items-start gap-3 p-3 rounded-xl ${!m.read ? 'bg-brand-500/5 border border-brand-500/20' : 'bg-dark-800/50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${!m.read ? 'bg-brand-500 text-white' : 'bg-dark-700 text-slate-400'}`}>
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{m.subject || m.message.slice(0, 40)}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No messages yet.</p>}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="font-bold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/admin/projects', label: 'Add Project', icon: FolderOpen, color: 'bg-brand-500' },
            { to: '/admin/services', label: 'Edit Services', icon: Wrench, color: 'bg-emerald-600' },
            { to: '/admin/team', label: 'Update Team', icon: Users, color: 'bg-purple-600' },
            { to: '/', label: 'View Site', icon: Eye, color: 'bg-dark-700', target: '_blank' },
          ].map((action) => (
            <Link key={action.label} to={action.to} target={action.target as any} className={`${action.color} hover:opacity-90 transition-opacity rounded-xl p-4 flex flex-col items-center gap-2 text-white`}>
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
