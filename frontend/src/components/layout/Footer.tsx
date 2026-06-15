import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Youtube, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SiteSettings } from '../../types';

const SERVICES_LIST = [
  'Building Construction',
  'Renovation & Remodeling',
  'Civil & Structural Engineering',
  'Project Management',
  'Interior Design & Finishing',
  'Electrical & Mechanical Works',
  'Road & Civil Works',
  'Property Development',
];

export function Footer() {
  const { data: s } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <footer>

      {/* ── PRE-FOOTER CTA ── */}
      <div style={{ background: 'linear-gradient(135deg, #0B1E3D 0%, #122d6e 100%)' }}>
        <div className="container-max px-4 md:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left — headline */}
            <div className="text-center lg:text-left">
              <p className="text-xs uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#F0B429' }}>
                Let's Work Together
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Ready to Build Something<br className="hidden md:block" /> Great?
              </h3>
              <p className="text-white/40 mt-3 text-base max-w-md">
                Get a free consultation and detailed project estimate within 48 hours. No obligation.
              </p>
            </div>

            {/* Centre — 3 stats */}
            <div className="hidden lg:flex items-center gap-0 divide-x divide-white/10 border border-white/10 flex-shrink-0">
              {[
                { value: '250+', label: 'Projects Done' },
                { value: '15+',  label: 'Years Active' },
                { value: '180+', label: 'Happy Clients' },
              ].map((stat) => (
                <div key={stat.label} className="px-8 py-5 text-center">
                  <p className="text-2xl font-black" style={{ color: '#F0B429' }}>{stat.value}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Right — buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/contact" className="btn-gold text-sm px-7 py-3.5">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
              {s?.whatsapp ? (
                <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="btn-outline-white text-sm px-7 py-3.5 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              ) : (
                <a href={`tel:${s?.phone || '09060203705'}`}
                  className="btn-outline-white text-sm px-7 py-3.5 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call Us Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="bg-navy-950" style={{ backgroundColor: 'var(--navy-950)' }}>
        <div className="container-max px-4 md:px-8 pt-20 pb-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/images/sna-logo.png" alt="SNA Construction" className="h-12 w-auto object-contain brightness-200 mb-5" />
            <p className="text-white/40 text-sm leading-relaxed">
              {s?.about_short || 'A full-service building and civil engineering construction company delivering world-class projects across West Africa.'}
            </p>
            {/* Certifications */}
            <div className="mt-6 space-y-2">
              {['COREN Registered', 'ISO 9001:2015 Certified', 'NIA Member', 'NIQS Registered'].map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-xs text-white/30">
                  <span className="w-1 h-1 bg-gold-400 rounded-full flex-shrink-0" />
                  {cert}
                </div>
              ))}
            </div>
            {/* Social */}
            <div className="flex gap-2 mt-7">
              {[
                { href: s?.facebook,  icon: <Facebook className="w-4 h-4" />,  label: 'Facebook' },
                { href: s?.instagram, icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                { href: s?.linkedin,  icon: <Linkedin className="w-4 h-4" />,  label: 'LinkedIn' },
                { href: s?.twitter,   icon: <Twitter className="w-4 h-4" />,   label: 'Twitter' },
              ].filter(l => l.href).map(({ href, icon, label }) => (
                <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-gold-400 hover:text-gold-400 transition-all">
                  {icon}
                </a>
              ))}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-gold-400 hover:text-gold-400 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.12em] mb-6">Our Services</h4>
            <ul className="space-y-3">
              {SERVICES_LIST.map((svc) => (
                <li key={svc}>
                  <Link to="/services"
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold-400" />
                    {svc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.12em] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ['/', 'Home'],
                ['/about', 'About Us'],
                ['/projects', 'Our Projects'],
                ['/projects?status=completed', 'Completed Projects'],
                ['/projects?status=ongoing', 'Ongoing Projects'],
                ['/services', 'Our Services'],
                ['/contact', 'Contact Us'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to}
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-[0.12em] mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F0B429' }} />
                <span className="text-sm text-white/40 leading-relaxed">
                  {s?.address || 'Wuraola House, 90 Allen Ave, Allen, Ikeja 101233, Lagos, Nigeria'}
                </span>
              </li>
              <li>
                <a href={`tel:${s?.phone}`}
                  className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B429' }} />
                  {s?.phone || '09060203705'}
                </a>
              </li>
              <li>
                <a href={`mailto:${s?.email}`}
                  className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#F0B429' }} />
                  {s?.email || 'info@snaconstruction.com'}
                </a>
              </li>
              {s?.whatsapp && (
                <li>
                  <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    WhatsApp
                  </a>
                </li>
              )}
              <li className="pt-4 border-t border-white/5">
                <p className="text-[11px] text-white/25 uppercase tracking-wider mb-3">Office Hours</p>
                <p className="text-sm text-white/40">Monday – Friday: 8:00am – 6:00pm</p>
                <p className="text-sm text-white/40">Saturday: 9:00am – 2:00pm</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="container-max px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25">
              © {new Date().getFullYear()} SNA Construction Limited. All rights reserved.
            </p>
            <p className="text-[11px] text-white/20">
              RC: 1234567 &nbsp;·&nbsp; COREN Certified &nbsp;·&nbsp; NIA Member &nbsp;·&nbsp; ISO 9001:2015
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
