import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Trash2, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { Message } from '../../types';

export function AdminMessages() {
  const qc = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/messages').then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/messages/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          Messages
          {unread > 0 && <span className="bg-gold-500 text-dark-950 text-sm font-bold rounded-full px-3 py-0.5">{unread} new</span>}
        </h1>
        <p className="text-slate-400 text-sm">{messages.length} total enquiries from the contact form</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <div className="card p-16 text-center">
          <Mail className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No messages yet. They'll appear here when clients submit the contact form.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`card p-5 ${!msg.read ? 'border-brand-500/30 bg-brand-500/3' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${!msg.read ? 'bg-brand-500 text-white' : 'bg-dark-700 text-slate-400'}`}>
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{msg.name}</span>
                      {!msg.read && <span className="text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full">New</span>}
                      {msg.subject && <span className="text-xs text-slate-500">· {msg.subject}</span>}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                        <Mail className="w-3 h-3" /> {msg.email}
                      </a>
                      {msg.phone && (
                        <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Phone className="w-3 h-3" /> {msg.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 mt-3 leading-relaxed bg-dark-800/50 rounded-xl p-3">{msg.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span className="text-xs text-slate-600">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!msg.read && (
                    <button onClick={() => markRead.mutate(msg.id)} className="p-2 rounded-lg hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors" title="Mark as read">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { if (confirm('Delete this message?')) del.mutate(msg.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
