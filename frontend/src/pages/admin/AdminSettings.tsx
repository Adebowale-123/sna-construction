import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import api from '../../services/api';
import { SiteSettings } from '../../types';

export function AdminSettings() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings>({});
  const [saved, setSaved] = useState(false);

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data),
  });

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: SiteSettings) => api.post('/settings/bulk', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['settings'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  const f = (key: keyof SiteSettings) => ({
    value: form[key] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-slate-400 text-sm">Manage your website content and contact information</p>
        </div>
        <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="btn-primary py-2.5 px-6 text-sm">
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save All Changes'}</>}
        </button>
      </div>

      {/* Company Info */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-white border-b border-white/10 pb-3">Company Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Company Name</label>
            <input className="input-field" {...f('company_name')} />
          </div>
          <div>
            <label className="label">Tagline / Slogan</label>
            <input className="input-field" {...f('tagline')} />
          </div>
        </div>
        <div>
          <label className="label">Short Description (shown in footer & meta)</label>
          <textarea rows={2} className="input-field resize-none" {...f('about_short')} />
        </div>
        <div>
          <label className="label">Full About Us Text</label>
          <textarea rows={5} className="input-field resize-none" {...f('about_full')} />
        </div>
      </div>

      {/* Contact */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-white border-b border-white/10 pb-3">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Phone Number</label>
            <input className="input-field" {...f('phone')} placeholder="+234 812 345 6789" />
          </div>
          <div>
            <label className="label">WhatsApp Number (numbers only)</label>
            <input className="input-field" {...f('whatsapp')} placeholder="2348123456789" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email Address</label>
            <input type="email" className="input-field" {...f('email')} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Office Address</label>
            <input className="input-field" {...f('address')} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-white border-b border-white/10 pb-3">Homepage Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">Years Experience</label>
            <input className="input-field" {...f('years_experience')} placeholder="15" />
          </div>
          <div>
            <label className="label">Projects Completed</label>
            <input className="input-field" {...f('projects_completed')} placeholder="250+" />
          </div>
          <div>
            <label className="label">Happy Clients</label>
            <input className="input-field" {...f('happy_clients')} placeholder="180+" />
          </div>
          <div>
            <label className="label">Expert Staff</label>
            <input className="input-field" {...f('expert_staff')} placeholder="60+" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-white border-b border-white/10 pb-3">Social Media Links</h2>
        <div className="space-y-4">
          {[
            { key: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4 text-blue-400" />, placeholder: 'https://facebook.com/snaconstruction' },
            { key: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4 text-purple-400" />, placeholder: 'https://instagram.com/snaconstruction' },
            { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4 text-sky-400" />, placeholder: 'https://linkedin.com/company/snaconstruction' },
            { key: 'twitter', label: 'Twitter / X', icon: <Twitter className="w-4 h-4 text-slate-400" />, placeholder: 'https://twitter.com/snaconstruction' },
          ].map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center flex-shrink-0">{s.icon}</div>
              <div className="flex-1">
                <label className="label mb-1">{s.label}</label>
                <input className="input-field text-sm" placeholder={s.placeholder} {...f(s.key as keyof SiteSettings)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="btn-primary w-full justify-center py-3.5">
        {saved ? <><CheckCircle className="w-5 h-5" /> All changes saved!</> : <><Save className="w-5 h-5" /> {saveMutation.isPending ? 'Saving...' : 'Save All Changes'}</>}
      </button>
    </div>
  );
}
