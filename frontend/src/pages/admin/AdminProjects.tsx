import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Star, StarOff, Upload, X, Building2 } from 'lucide-react';
import api from '../../services/api';
import { Project } from '../../types';

const EMPTY: Partial<Project> = { title: '', description: '', category: 'residential', location: '', year: new Date().getFullYear(), client: '', value: '', duration: '', status: 'completed', featured: false, images: '[]' };
const CATEGORIES = ['residential', 'commercial', 'government', 'infrastructure', 'industrial'];
const STATUSES = ['completed', 'ongoing', 'upcoming'];

export function AdminProjects() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [form, setForm] = useState<Partial<Project>>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const qc = useQueryClient();

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (data: Partial<Project>) =>
      editing?.id ? api.patch(`/projects/${editing.id}`, data) : api.post('/projects', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); closeForm(); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const openEdit = (p: Project) => { setEditing(p); setForm(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      const res = await api.post('/upload/images?folder=projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const existing = (() => { try { return JSON.parse(form.images || '[]'); } catch { return []; } })();
      const newImages = JSON.stringify([...existing, ...res.data.urls]);
      setForm((f) => ({ ...f, images: newImages, thumbnail: existing.length === 0 ? res.data.urls[0] : f.thumbnail }));
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    const existing = (() => { try { return JSON.parse(form.images || '[]'); } catch { return []; } })();
    const updated = existing.filter((i: string) => i !== url);
    setForm((f) => ({ ...f, images: JSON.stringify(updated), thumbnail: f.thumbnail === url ? updated[0] || undefined : f.thumbnail }));
  };

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter || p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm">{projects.length} total projects</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 text-sm">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...CATEGORIES, ...STATUSES].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-brand-500 text-white' : 'bg-dark-800 text-slate-400 border border-white/10 hover:text-white'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => {
            const imgs = (() => { try { return JSON.parse(project.images); } catch { return []; } })();
            return (
              <div key={project.id} className="card p-5 flex items-center gap-4">
                <div className="w-16 h-14 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                  {project.thumbnail || imgs[0] ? (
                    <img src={project.thumbnail || imgs[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-slate-600" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white">{project.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'ongoing' ? 'bg-gold-500/20 text-gold-400' : project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>{project.status}</span>
                    {project.featured && <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{project.category} · {project.location} · {project.year} · {imgs.length} image{imgs.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => save.mutate({ featured: !project.featured })} className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="Toggle featured">
                    {project.featured ? <StarOff className="w-4 h-4 text-gold-400" /> : <Star className="w-4 h-4 text-slate-500 hover:text-gold-400" />}
                  </button>
                  <button onClick={() => openEdit(project)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if (confirm('Delete this project?')) del.mutate(project.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500">No projects found.</p>
              <button onClick={openNew} className="btn-primary mt-4 text-sm py-2 px-5"><Plus className="w-4 h-4" /> Add Project</button>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-dark-900 rounded-2xl border border-white/10 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={closeForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Project Title *</label>
                  <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Victoria Island Commercial Complex" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description *</label>
                  <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Project description..." />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category || 'residential'} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.status || 'completed'} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Location</label>
                  <input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="e.g. Victoria Island, Lagos" />
                </div>
                <div>
                  <label className="label">Year</label>
                  <input type="number" value={form.year || ''} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="input-field" />
                </div>
                <div>
                  <label className="label">Client Name</label>
                  <input value={form.client || ''} onChange={(e) => setForm({ ...form, client: e.target.value })} className="input-field" placeholder="e.g. Zenith Properties Ltd" />
                </div>
                <div>
                  <label className="label">Project Value</label>
                  <input value={form.value || ''} onChange={(e) => setForm({ ...form, value: e.target.value })} className="input-field" placeholder="e.g. ₦2.4 Billion" />
                </div>
                <div>
                  <label className="label">Duration</label>
                  <input value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="e.g. 18 months" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
                  <label htmlFor="featured" className="text-sm text-slate-300 cursor-pointer">Feature on homepage</label>
                </div>
              </div>

              {/* Image upload */}
              <div>
                <label className="label">Project Images</label>
                <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${uploading ? 'border-brand-500 bg-brand-500/5' : 'border-white/10 hover:border-brand-500/50'}`}>
                  <Upload className={`w-8 h-8 ${uploading ? 'text-brand-400 animate-bounce' : 'text-slate-500'}`} />
                  <p className="text-sm text-slate-400">{uploading ? 'Uploading...' : 'Click to upload images (JPEG, PNG, WebP)'}</p>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} disabled={uploading} />
                </label>

                {/* Image previews */}
                {(() => {
                  const imgs = (() => { try { return JSON.parse(form.images || '[]'); } catch { return []; } })();
                  return imgs.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imgs.map((img: string) => (
                        <div key={img} className={`relative aspect-video rounded-lg overflow-hidden ${form.thumbnail === img ? 'ring-2 ring-gold-400' : ''}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 hover:opacity-100">
                            <button onClick={() => setForm((f) => ({ ...f, thumbnail: img }))} className="text-xs bg-gold-500 text-dark-950 px-1.5 py-0.5 rounded font-bold">Cover</button>
                            <button onClick={() => removeImage(img)} className="bg-red-500 text-white p-1 rounded"><X className="w-3 h-3" /></button>
                          </div>
                          {form.thumbnail === img && <div className="absolute top-1 left-1 bg-gold-500 text-dark-950 text-xs px-1 rounded font-bold">Cover</div>}
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white text-sm font-medium transition-colors">Cancel</button>
              <button
                onClick={() => save.mutate(form)}
                disabled={save.isPending || !form.title}
                className="flex-1 btn-primary justify-center py-2.5 text-sm"
              >
                {save.isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
