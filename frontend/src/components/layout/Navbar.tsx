import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SiteSettings } from '../../types';

const NAV_LINKS = [
  { to: '/',                          label: 'Home',                end: true,  search: null },
  { to: '/about',                     label: 'About Us',            end: false, search: null },
  { to: '/services',                  label: 'Services',            end: false, search: null },
  { to: '/projects',                  label: 'All Projects',        end: false, search: '' },
  { to: '/projects?status=completed', label: 'Completed Projects',  end: false, search: 'status=completed', icon: <CheckCircle className="w-3 h-3 text-emerald-500" /> },
  { to: '/projects?status=ongoing',   label: 'Ongoing Projects',    end: false, search: 'status=ongoing',   icon: <Clock className="w-3 h-3 text-amber-500" /> },
  { to: '/contact',                   label: 'Contact',             end: false, search: null },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (link: typeof NAV_LINKS[number]) => {
    if (link.to === '/') return location.pathname === '/';
    if (link.search !== null) {
      const currentSearch = location.search.replace('?', '');
      return location.pathname === '/projects' && currentSearch === link.search;
    }
    return location.pathname.startsWith(link.to);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gold accent line */}
      <div className="h-[3px] bg-gold-500 w-full" />

      {/* Top utility bar */}
      <div className="hidden md:block bg-navy-950">
        <div className="container-max flex items-center justify-between px-4 md:px-8 py-2.5">
          <p className="text-[11px] text-white/40 tracking-wide">
            {settings?.address || 'Wuraola House, 90 Allen Ave, Ikeja, Lagos, Nigeria'}
          </p>
          <div className="flex items-center gap-6">
            <a href={`tel:${settings?.phone}`}
              className="flex items-center gap-2 text-[11px] text-white/50 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> {settings?.phone || '+2348027672448'}
            </a>
            <a href={`mailto:${settings?.email}`}
              className="flex items-center gap-2 text-[11px] text-white/50 hover:text-white transition-colors">
              <Mail className="w-3 h-3" /> {settings?.email || 'sna.constructions@outlook.com'}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'border-b border-gray-100'}`}>
        <div className="container-max flex items-center justify-between px-4 md:px-8 py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 py-4">
            <img src="/images/sna-logo.png" alt="SNA Construction" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center h-full">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-1.5 px-4 py-6 text-sm font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap ${
                    active ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'
                  }`}
                >
                  {link.icon && link.icon}
                  {link.label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold-500" />}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${settings?.phone || '+2348027672448'}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors">
              <Phone className="w-4 h-4 text-brand-500" />
              <span className="hidden xl:inline">{settings?.phone || '+2348027672448'}</span>
            </a>
            <Link to="/contact" className="btn-navy text-sm py-3 px-6">
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-navy-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold border-l-2 transition-colors ${
                      active
                        ? 'border-gold-500 text-navy-900 bg-gray-50'
                        : 'border-transparent text-gray-500 hover:text-navy-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon && link.icon}
                      {link.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-30" />
                  </Link>
                );
              })}
            </div>
            <div className="px-4 pb-5 pt-2 border-t border-gray-100 space-y-2 mt-2">
              <a href={`tel:${settings?.phone}`}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-brand-500" />
                {settings?.phone || '+2348027672448'}
              </a>
              <Link to="/contact" className="btn-navy w-full justify-center text-sm">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
