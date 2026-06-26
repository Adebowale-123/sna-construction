import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle, Clock, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.18 8.18 0 0 0 4.83 1.56V6.75a4.85 4.85 0 0 1-1.06-.06z"/>
  </svg>
);

const SOCIALS = [
  { label: 'Facebook',   icon: <Facebook className="w-5 h-5" />,  href: '#', bg: 'hover:bg-blue-600',    desc: 'Connect on Facebook'  },
  { label: 'Instagram',  icon: <Instagram className="w-5 h-5" />, href: '#', bg: 'hover:bg-pink-600',    desc: 'Follow on Instagram'  },
  { label: 'LinkedIn',   icon: <Linkedin className="w-5 h-5" />,  href: '#', bg: 'hover:bg-blue-700',    desc: 'Connect on LinkedIn'  },
  { label: 'X / Twitter',icon: <Twitter className="w-5 h-5" />,   href: '#', bg: 'hover:bg-gray-900',    desc: 'Follow on X'          },
  { label: 'YouTube',    icon: <Youtube className="w-5 h-5" />,   href: '#', bg: 'hover:bg-red-600',     desc: 'Subscribe on YouTube' },
  { label: 'TikTok',     icon: <TikTokIcon />,                     href: '#', bg: 'hover:bg-gray-900',    desc: 'Follow on TikTok'     },
  { label: 'WhatsApp',   icon: <MessageCircle className="w-5 h-5" />, href: '#', bg: 'hover:bg-emerald-600', desc: 'Chat on WhatsApp' },
];
import api from '../services/api';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';

const HERO_IMG = 'https://images.unsplash.com/photo-1543414347-1c348021f279?auto=format&fit=crop&w=1920&q=90';

const SERVICES = [
  'Building Construction', 'Renovation & Remodeling', 'Civil & Structural Engineering',
  'Project Management', 'Interior Design & Finishing', 'Electrical & Mechanical Works',
  'Road & Civil Works', 'Property Development', 'Other / General Enquiry',
];

export function Contact() {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data),
  });

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await api.post('/messages', form);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-[107px]">
      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="Contact SNA" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-500" />
        <div className="relative container-max px-4 md:px-8">
          <span className="eyebrow-white reveal">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mt-1 reveal delay-100">Contact Us</h1>
          <p className="text-white/50 text-lg mt-4 max-w-xl reveal delay-200">
            Ready to start your project? Our team is here to help — from the first call to project delivery.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-navy-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold">Contact Us</span>
        </div>
      </div>

      {/* ── CONTACT INFO STRIP ── */}
      <div className="bg-navy-900">
        <div className="container-max px-4 md:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/8">
          <a href={`tel:${settings?.phone}`}
            className="flex items-center gap-4 group px-6 py-5 hover:bg-white/3 transition-colors">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gold-400 transition-colors">
              <Phone className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold">Call Us</p>
              <p className="text-white font-bold mt-1">{settings?.phone || '+2348027672448'}</p>
              <p className="text-white/30 text-xs mt-0.5">Available 24/7 for emergencies</p>
            </div>
          </a>
          <a href={`mailto:${settings?.email}`}
            className="flex items-center gap-4 group px-6 py-5 hover:bg-white/3 transition-colors">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-gold-400 transition-colors">
              <Mail className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold">Email Us</p>
              <p className="text-white font-bold mt-1">{settings?.email || 'sna.constructions@outlook.com'}</p>
              <p className="text-white/30 text-xs mt-0.5">Response within 24 hours</p>
            </div>
          </a>
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-semibold">Visit Us</p>
              <p className="text-white font-medium mt-1 text-sm leading-snug">
                {settings?.address || 'Wuraola House, 90 Allen Ave, Ikeja, Lagos'}
              </p>
              <p className="text-white/30 text-xs mt-0.5">Mon–Fri: 8:00am – 6:00pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <section className="py-20 bg-[#F7F8FA]">
        <div className="container-max px-4 md:px-8 grid lg:grid-cols-5 gap-10">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="reveal">
              <h2 className="text-2xl font-black text-navy-900">Let's Build Together</h2>
              <p className="text-gray-500 mt-3 leading-relaxed">
                Whether you have a project in mind or need expert advice, our team is here to help. Fill out the form or reach us directly.
              </p>
            </div>

            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="reveal flex items-center gap-4 bg-emerald-500 hover:bg-emerald-600 p-5 transition-colors group">
                <div className="w-11 h-11 bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">Chat on WhatsApp</p>
                  <p className="text-emerald-100 text-sm">Instant response</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {/* Why contact us */}
            <div className="reveal bg-white border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-50">
                <p className="text-sm font-bold text-navy-900">Why Contact Us?</p>
              </div>
              <div className="p-5 space-y-3">
                {[
                  'Free initial consultation — no obligation',
                  'Expert advice from COREN engineers',
                  'Detailed cost estimates within 48 hours',
                  'Site visits arranged at your convenience',
                  '5-year warranty on all completed projects',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="reveal bg-white border border-gray-100 p-5">
              <p className="text-sm font-bold text-navy-900 mb-4">Follow Us on Social Media</p>
              <div className="grid grid-cols-4 gap-2">
                {SOCIALS.map(({ label, icon, href, bg, desc }) => (
                  <a key={label} href={href}
                    target={href !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    title={desc}
                    className={`flex flex-col items-center gap-1.5 py-3 bg-gray-50 hover:text-white transition-all group ${bg}`}
                  >
                    <span className="text-gray-500 group-hover:text-white transition-colors">{icon}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors leading-none">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="reveal overflow-hidden border border-gray-100 h-56">
              <iframe
                title="SNA Construction Location"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=Allen+Avenue+Ikeja+Lagos+Nigeria"
                className="border-0"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 reveal delay-200">
            <div className="bg-white border border-gray-100 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-navy-900">Request a Free Quote</h2>
                <p className="text-gray-400 text-sm mt-1">Fill out the form and our team will respond within 24 hours.</p>
              </div>

              {status === 'sent' ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900">Message Sent!</h3>
                  <p className="text-gray-500 max-w-sm">Thank you for contacting SNA Construction. We'll review your enquiry and be in touch within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="btn-navy mt-2 text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="pub-label">Full Name *</label>
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Emeka Okafor" className="pub-input" />
                    </div>
                    <div>
                      <label className="pub-label">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com" className="pub-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="pub-label">Phone Number</label>
                      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+234 800 000 0000" className="pub-input" />
                    </div>
                    <div>
                      <label className="pub-label">Service Required</label>
                      <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="pub-input">
                        <option value="">Select a service...</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="pub-label">Project Details *</label>
                    <textarea required rows={5} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your project — location, size, timeline, budget range..."
                      className="pub-input resize-none" />
                  </div>
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-600">
                      Failed to send. Please try again or call us directly.
                    </div>
                  )}
                  <button type="submit" disabled={status === 'sending'}
                    className="btn-navy w-full justify-center py-4 text-sm"
                    style={{ opacity: status === 'sending' ? 0.7 : 1 }}>
                    {status === 'sending'
                      ? <><Clock className="w-5 h-5 animate-spin" /> Sending...</>
                      : <><Send className="w-5 h-5" /> Send Message <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Free consultation · No obligation · We respond within 24 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
