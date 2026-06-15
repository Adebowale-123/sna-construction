import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Upload, Users } from 'lucide-react';
import api from '../../services/api';
import { TeamMember } from '../../types';

const EMPTY: Partial<TeamMember> = { name: '', role: '', bio: '', email: '', linkedin: '', order: 0 };

export function AdminTeam() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (d: Partial<TeamMember>) => editing ? api.patch(`/team/${editing.id}`, d) : api.post('/team', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); closeForm(); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/team/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['team'] }),
  });

  const openEdit = (m: TeamMember) => { setEditing(m); setForm(m); setShowForm(true); };
  const openNew = () => { setEditing(null); setForm({ ...EMPTY, order: team.length }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', files[0]);
    try {
      const res = await api.post('/upload/image?folder=team', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-slate-400 text-sm">{team.length} members in the leadership team</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add Member</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member) => (
          <div key={member.id} className="card p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-dark-700 flex-shrink-0 flex items-center justify-center">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-brand-400">{member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{member.name}</p>
                <p className="text-xs text-brand-400">{member.role}</p>
                {member.bio && <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{member.bio}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
              <button onClick={() => openEdit(member)} className="flex-1 py-1.5 text-xs rounded-lg bg-dark-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
              <button onClick={() => { if (confirm('Delete?')) del.mutate(member.id); }} className="py-1.5 px-3 text-xs rounded-lg bg-dark-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {team.length === 0 && (
          <div className="col-span-3 card p-12 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No team members yet.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-dark-900 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-bold text-white">{editing ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button onClick={closeForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Photo upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center">
                  {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <span className="text-xl font-bold text-slate-500">{(form.name || 'A').charAt(0)}</span>}
                </div>
                <label className="btn-outline text-xs py-2 px-4 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" /> {uploading ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
                </label>
              </div>
              <div>
                <label className="label">Full Name *</label>
                <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Engr. Samuel Nwachukwu" />
              </div>
              <div>
                <label className="label">Role / Position *</label>
                <input value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" placeholder="e.g. CEO & Principal Engineer" />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea rows={3} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" placeholder="Short professional bio..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" />
                </div>
                <div>
                  <label className="label">Order</label>
                  <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input-field" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.name} className="flex-1 btn-primary justify-center py-2.5 text-sm">
                {save.isPending ? 'Saving...' : editing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
