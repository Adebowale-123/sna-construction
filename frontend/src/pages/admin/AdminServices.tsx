import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react';
import api from '../../services/api';
import { Service } from '../../types';

const ICONS = ['building', 'hammer', 'cog', 'clipboard', 'paint', 'zap', 'road', 'home'];
const EMPTY: Partial<Service> = { title: '', description: '', icon: 'building', features: '[]', order: 0 };

export function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(EMPTY);
  const [featureInput, setFeatureInput] = useState('');
  const qc = useQueryClient();

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (d: Partial<Service>) => editing ? api.patch(`/services/${editing.id}`, d) : api.post('/services', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); closeForm(); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });

  const openEdit = (s: Service) => { setEditing(s); setForm(s); setShowForm(true); };
  const openNew = () => { setEditing(null); setForm({ ...EMPTY, order: services.length }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); setFeatureInput(''); };

  const features = (() => { try { return JSON.parse(form.features || '[]'); } catch { return []; } })();
  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((f) => ({ ...f, features: JSON.stringify([...features, featureInput.trim()]) }));
    setFeatureInput('');
  };
  const removeFeature = (i: number) => {
    setForm((f) => ({ ...f, features: JSON.stringify(features.filter((_: string, idx: number) => idx !== i)) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 text-sm">{services.length} services listed on the website</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add Service</button>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const feats = (() => { try { return JSON.parse(service.features); } catch { return []; } })();
          return (
            <div key={service.id} className="card p-5 flex items-start gap-4">
              <GripVertical className="w-4 h-4 text-slate-600 mt-1 flex-shrink-0" />
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold flex-shrink-0">{service.order + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white">{service.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{service.description}</p>
                {feats.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {feats.slice(0, 3).map((f: string) => <span key={f} className="text-xs bg-dark-700 text-slate-400 px-2 py-0.5 rounded-full">{f}</span>)}
                    {feats.length > 3 && <span className="text-xs text-slate-600">+{feats.length - 3} more</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(service)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm('Delete?')) del.mutate(service.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-dark-900 rounded-2xl border border-white/10 my-8">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-bold text-white">{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={closeForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Title *</label>
                <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Building Construction" />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Icon</label>
                  <select value={form.icon || 'building'} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field">
                    {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Order</label>
                  <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Features / Bullet Points</label>
                <div className="space-y-2">
                  {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-dark-800 rounded-lg px-3 py-2">
                      <span className="flex-1 text-sm text-slate-300">{f}</span>
                      <button onClick={() => removeFeature(i)}><X className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addFeature()} className="input-field text-sm" placeholder="Add a feature..." />
                    <button onClick={addFeature} className="px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-medium hover:bg-brand-600 transition-colors flex-shrink-0">Add</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.title} className="flex-1 btn-primary justify-center py-2.5 text-sm">
                {save.isPending ? 'Saving...' : editing ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
