import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ArrowRight, ChevronDown, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { SiteSettings } from '../../types';

const BASE_LINKS = [
  { to: '/',        label: 'Home' },
  { to: '/about',   label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
];

const PROJECT_ITEMS = [
  { to: '/projects',                   label: 'All Projects',       icon: <ArrowRight className="w-3.5 h-3.5" />, desc: 'View full portfolio' },
  { to: '/projects?status=completed',  label: 'Completed Projects',  icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />, desc: 'Delivered & handed over' },
  { to: '/projects?status=ongoing',    label: 'Ongoing Projects',    icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,   desc: 'Currently in progress' },
  { to: '/projects?status=upcoming',   label: 'Upcoming Projects',   icon: <Calendar className="w-3.5 h-3.5 text-sky-500" />,   desc: 'Starting soon' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [desktopProjectsOpen, setDesktopProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setMobileOpen(false);
    setMobileProjectsOpen(false);
    setDesktopProjectsOpen(false);
  }, [location]);

  const isProjectsActive = location.pathname.startsWith('/projects');

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
              <Phone className="w-3 h-3" /> {settings?.phone || '09060203705'}
            </a>
            <a href={`mailto:${settings?.email}`}
              className="flex items-center gap-2 text-[11px] text-white/50 hover:text-white transition-colors">
              <Mail className="w-3 h-3" /> {settings?.email || 'info@snaconstruction.com'}
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
            {BASE_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative px-5 py-6 text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold-500" />}
                  </>
                )}
              </NavLink>
            ))}

            {/* Projects dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDesktopProjectsOpen(true)}
              onMouseLeave={() => setDesktopProjectsOpen(false)}
            >
              <NavLink
                to="/projects"
                className={`relative flex items-center gap-1.5 px-5 py-6 text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  isProjectsActive ? 'text-navy-900' : 'text-gray-500 hover:text-navy-900'
                }`}
              >
                Projects
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopProjectsOpen ? 'rotate-180' : ''}`} />
                {isProjectsActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold-500" />}
              </NavLink>

              {desktopProjectsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-2xl py-2 z-50">
                  {PROJECT_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                    >
                      <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-navy-900 transition-colors">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${settings?.phone || '09060203705'}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900 transition-colors">
              <Phone className="w-4 h-4 text-brand-500" />
              <span className="hidden xl:inline">{settings?.phone || '09060203705'}</span>
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
              {BASE_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3.5 text-sm font-semibold border-l-2 transition-colors ${
                      isActive
                        ? 'border-gold-500 text-navy-900 bg-gray-50'
                        : 'border-transparent text-gray-500 hover:text-navy-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 opacity-30" />
                </NavLink>
              ))}

              {/* Mobile Projects expandable */}
              <button
                onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold border-l-2 transition-colors ${
                  isProjectsActive
                    ? 'border-gold-500 text-navy-900 bg-gray-50'
                    : 'border-transparent text-gray-500 hover:text-navy-900 hover:bg-gray-50'
                }`}
              >
                Projects
                <ChevronDown className={`w-4 h-4 opacity-40 transition-transform ${mobileProjectsOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileProjectsOpen && (
                <div className="ml-4 border-l border-gray-100 pl-3 space-y-0.5 pb-1">
                  {PROJECT_ITEMS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-500 hover:text-navy-900 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 pb-5 pt-2 border-t border-gray-100 space-y-2 mt-2">
              <a href={`tel:${settings?.phone}`}
                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-brand-500" />
                {settings?.phone || '09060203705'}
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
