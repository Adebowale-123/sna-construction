import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import api from '../../services/api';
import { Testimonial } from '../../types';

const EMPTY: Partial<Testimonial> = { name: '', company: '', role: '', text: '', rating: 5, featured: true };

export function AdminTestimonials() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(EMPTY);
  const qc = useQueryClient();

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (d: Partial<Testimonial>) => editing ? api.patch(`/testimonials/${editing.id}`, d) : api.post('/testimonials', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); closeForm(); },
  });

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const openEdit = (t: Testimonial) => { setEditing(t); setForm(t); setShowForm(true); };
  const openNew = () => { setEditing(null); setForm(EMPTY); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-slate-400 text-sm">{testimonials.length} client reviews</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 text-sm"><Plus className="w-4 h-4" /> Add Review</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= t.rating ? 'fill-gold-400 text-gold-400' : 'text-slate-700'}`} />)}
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed line-clamp-3">"{t.text}"</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div>
                <p className="font-semibold text-white text-sm">{t.name}</p>
                {t.role && <p className="text-xs text-brand-400">{t.role}</p>}
                {t.company && <p className="text-xs text-slate-500">{t.company}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => { if (confirm('Delete?')) del.mutate(t.id); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-dark-900 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-bold text-white">{editing ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={closeForm}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Client Name *</label>
                <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Role</label>
                  <input value={form.role || ''} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field" placeholder="e.g. Managing Director" />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Review Text *</label>
                <textarea rows={4} value={form.text || ''} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((i) => (
                    <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })}>
                      <Star className={`w-6 h-6 transition-colors ${i <= (form.rating || 5) ? 'fill-gold-400 text-gold-400' : 'text-slate-600 hover:text-gold-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured_t" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
                <label htmlFor="featured_t" className="text-sm text-slate-300 cursor-pointer">Show on homepage</label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-white/10">
              <button onClick={closeForm} className="flex-1 px-4 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-sm">Cancel</button>
              <button onClick={() => save.mutate(form)} disabled={save.isPending || !form.name || !form.text} className="flex-1 btn-primary justify-center py-2.5 text-sm">
                {save.isPending ? 'Saving...' : editing ? 'Save Changes' : 'Add Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
