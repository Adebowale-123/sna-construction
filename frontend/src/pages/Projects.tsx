import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, MapPin, Calendar, CheckCircle, Clock, Phone, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import api from '../services/api';
import { Project } from '../types';

const HERO_IMG = '/images/magodo-project/exterior-2.jpeg';

const MAGODO_GALLERY = [
  { src: '/images/magodo-project/exterior-2.jpeg',   label: 'Exterior' },
  { src: '/images/magodo-project/living-room.jpeg',  label: 'Living Room' },
  { src: '/images/magodo-project/kitchen-1.jpeg',    label: 'Kitchen' },
  { src: '/images/magodo-project/kitchen-2.jpeg',    label: 'Kitchen' },
  { src: '/images/magodo-project/staircase.jpeg',    label: 'Staircase' },
  { src: '/images/magodo-project/bedroom.jpeg',      label: 'Master Bedroom' },
  { src: '/images/magodo-project/hallway.jpeg',      label: 'Hallway' },
  { src: '/images/magodo-project/living-area-2.jpeg',label: 'Lounge' },
];

/* ── Showcase projects (shown when admin hasn't added real projects yet) ── */
const SHOWCASE: Project[] = [
  /* ─ COMPLETED ─ */
  {
    id: 'sc-magodo',
    title: 'Luxury 4-Bedroom Duplex — Magodo',
    description: 'Just-completed luxury 4-bedroom duplex in Magodo, Lagos. Finished to the highest specification: full polished marble flooring throughout, modern kitchen with black granite countertops and wood-accent cabinets, dramatic staircase with glass balustrade and gold rails with LED strip lighting, tray ceilings with recessed LED strips in every room, built-in wardrobes, wide marble entrance hallway with solid wood door, and a landscaped compound with ample parking.',
    category: 'residential', location: 'Magodo, Lagos', year: 2026, value: '₦180M', client: 'Private Client',
    images: '["/images/magodo-project/exterior-2.jpeg","/images/magodo-project/kitchen-1.jpeg","/images/magodo-project/kitchen-2.jpeg","/images/magodo-project/living-room.jpeg","/images/magodo-project/staircase.jpeg","/images/magodo-project/bedroom.jpeg","/images/magodo-project/hallway.jpeg","/images/magodo-project/living-area-2.jpeg"]',
    thumbnail: '/images/magodo-project/exterior-2.jpeg',
    featured: true, status: 'completed', createdAt: '2026-06-01',
  },
  {
    id: 'sc1', title: 'Marina Bay Commercial Tower',
    description: 'A 15-floor commercial tower on Victoria Island featuring premium office spaces, ground-floor retail, and a rooftop terrace. Delivered 6 weeks ahead of schedule.',
    category: 'commercial', location: 'Victoria Island, Lagos', year: 2023, value: '₦2.8B', client: 'Zenith Property Group',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1771457362601-4818d59107d2?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'completed', createdAt: '2023-01-01',
  },
  {
    id: 'sc2', title: 'Ikoyi Heights Luxury Residences',
    description: 'Premium gated estate comprising 48 luxury apartments and penthouse units with smart-home automation, gym, spa, and concierge services.',
    category: 'residential', location: 'Ikoyi, Lagos', year: 2024, value: '₦1.5B', client: 'Private Developer',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1763454242946-948f870d730c?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'completed', createdAt: '2024-01-01',
  },
  {
    id: 'sc3', title: 'Abuja Federal Secretariat Renovation',
    description: 'Full structural rehabilitation and interior upgrade of the Federal Secretariat complex including new MEP systems and modern workspaces.',
    category: 'government', location: 'Central Area, Abuja', year: 2023, value: '₦620M', client: 'Federal Ministry of Works',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1700469919563-ef267d459da5?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'completed', createdAt: '2023-06-01',
  },

  /* ─ ONGOING ─ */
  {
    id: 'sc4', title: 'Lekki Phase II Office Complex',
    description: 'State-of-the-art multi-tenant office complex spanning 22,000 sqm in the fast-growing Lekki corridor. Targeting LEED Silver certification.',
    category: 'commercial', location: 'Lekki Phase II, Lagos', year: 2025, value: '₦4.2B', client: 'Lekki Free Zone Authority',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1630254428244-ac29b798067f?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'ongoing', createdAt: '2024-06-01',
  },
  {
    id: 'sc5', title: 'Gbagada Estate Phase 3 — Residential',
    description: '120 mid-range residential units across 3 blocks with integrated amenities: pool, sports court, playground and 24/7 security.',
    category: 'residential', location: 'Gbagada, Lagos', year: 2025, value: '₦1.1B', client: 'SNA Development Ltd',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'ongoing', createdAt: '2024-09-01',
  },
  {
    id: 'sc6', title: 'Lagos–Ibadan Expressway Service Areas',
    description: 'Construction of three full-service rest areas along the Lagos–Ibadan corridor including fuel stations, restaurants and vehicle inspection bays.',
    category: 'infrastructure', location: 'Ogun State', year: 2025, value: '₦780M', client: 'FGNWORKS',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1765378025221-3ed7eadc6def?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'ongoing', createdAt: '2024-11-01',
  },

  /* ─ UPCOMING ─ */
  {
    id: 'sc7', title: 'Eko Atlantic Mixed-Use Tower',
    description: 'Landmark 30-floor mixed-use skyscraper on Eko Atlantic City: luxury condominiums on upper floors, Grade-A office space, and a retail podium.',
    category: 'commercial', location: 'Eko Atlantic City, Lagos', year: 2026, value: '₦6.5B', client: 'South Energyx Nigeria',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1621355254187-22a61da5ec52?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'upcoming', createdAt: '2025-01-01',
  },
  {
    id: 'sc8', title: 'Maitama Industrial Park',
    description: 'Purpose-built industrial estate in Abuja comprising 60 factory units, warehousing facilities and a central administration block.',
    category: 'industrial', location: 'Maitama, Abuja', year: 2026, value: '₦2.3B', client: 'Abuja Industrial Consortium',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1741023705492-48561fc75bab?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'upcoming', createdAt: '2025-03-01',
  },
  {
    id: 'sc9', title: 'University of Lagos Science Faculty',
    description: 'New state-of-the-art science and technology faculty building with smart lecture theatres, laboratories and a 400-seat auditorium.',
    category: 'government', location: 'Yaba, Lagos', year: 2026, value: '₦1.8B', client: 'University of Lagos',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1700469919563-ef267d459da5?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'upcoming', createdAt: '2025-04-01',
  },
];

const CATEGORIES = [
  { id: 'all',             label: 'All Types' },
  { id: 'residential',    label: 'Residential' },
  { id: 'commercial',     label: 'Commercial' },
  { id: 'government',     label: 'Government' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'industrial',     label: 'Industrial' },
];

const STATUS_TABS = [
  { id: 'all',       label: 'All Projects',  icon: null },
  { id: 'completed', label: 'Completed',     icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'ongoing',   label: 'Ongoing',       icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'upcoming',  label: 'Upcoming',      icon: <Calendar className="w-3.5 h-3.5 text-sky-400" /> },
];

const STATUS_BADGE: Record<string, string> = {
  completed: 'bg-emerald-500 text-white',
  ongoing:   'bg-amber-500 text-white',
  upcoming:  'bg-sky-500 text-white',
};

const STATUS_LABEL: Record<string, string> = {
  completed: 'Completed',
  ongoing:   'Ongoing',
  upcoming:  'Upcoming',
};

const CAT_STYLES: Record<string, string> = {
  residential:    'bg-white/90 text-emerald-800',
  commercial:     'bg-white/90 text-sky-800',
  government:     'bg-white/90 text-violet-800',
  infrastructure: 'bg-white/90 text-amber-800',
  industrial:     'bg-white/90 text-orange-800',
};

export function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    const s = searchParams.get('status') || 'all';
    setActiveStatus(s);
  }, [searchParams]);

  const { data: apiProjects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then((r) => r.data),
  });

  const isShowcase = apiProjects.length === 0 && !isLoading;
  const allProjects = isShowcase ? SHOWCASE : apiProjects;

  const filtered = allProjects.filter((p) => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const statusMatch = activeStatus === 'all' || p.status === activeStatus;
    return catMatch && statusMatch;
  });

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevLight = () => setLightboxIdx(i => i === null ? null : (i - 1 + MAGODO_GALLERY.length) % MAGODO_GALLERY.length);
  const nextLight = () => setLightboxIdx(i => i === null ? null : (i + 1) % MAGODO_GALLERY.length);

  const handleStatusChange = (s: string) => {
    setActiveStatus(s);
    setActiveCategory('all');
    if (s === 'all') setSearchParams({});
    else setSearchParams({ status: s });
  };

  const heroTitle = activeStatus === 'completed' ? 'Completed Projects'
    : activeStatus === 'ongoing' ? 'Ongoing Projects'
    : activeStatus === 'upcoming' ? 'Upcoming Projects'
    : 'Our Projects';

  return (
    <div className="pt-[107px]">
      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="Projects" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-500" />
        <div className="relative container-max px-4 md:px-8">
          <span className="eyebrow-white reveal">Our Portfolio</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mt-1 reveal delay-100">
            {heroTitle}
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-xl reveal delay-200">
            {allProjects.length}+ projects delivered across Nigeria — residential, commercial, government & infrastructure
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-navy-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-navy-900 transition-colors">Projects</Link>
          {activeStatus !== 'all' && (
            <><span>/</span><span className="text-navy-900 font-semibold capitalize">{activeStatus}</span></>
          )}
        </div>
      </div>

      {/* ── MAGODO FEATURED GALLERY ── */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container-max px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 mb-2">
                <CheckCircle className="w-3.5 h-3.5" /> Just Completed · 2026
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-navy-900 leading-tight">
                Luxury 4-Bedroom Duplex — Magodo, Lagos
              </h2>
              <p className="text-gray-500 text-sm mt-1.5 max-w-xl">
                Polished marble floors · Black granite kitchen · Glass & gold staircase · LED tray ceilings · Private compound
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Project Value</p>
              <p className="text-2xl font-black text-gold-600">₦180M</p>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Large first photo */}
            <button
              onClick={() => openLightbox(0)}
              className="col-span-2 row-span-2 relative overflow-hidden group h-72 md:h-auto"
            >
              <img src={MAGODO_GALLERY[0].src} alt={MAGODO_GALLERY[0].label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="absolute bottom-3 left-3 bg-navy-950/70 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1">
                {MAGODO_GALLERY[0].label}
              </span>
            </button>

            {/* Remaining 6 photos */}
            {MAGODO_GALLERY.slice(1, 7).map((photo, i) => (
              <button
                key={photo.src}
                onClick={() => openLightbox(i + 1)}
                className="relative overflow-hidden group h-36"
              >
                <img src={photo.src} alt={photo.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="absolute bottom-2 left-2 bg-navy-950/70 text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5">
                  {photo.label}
                </span>
                {/* Last tile: show "+1 more" overlay */}
                {i === 5 && MAGODO_GALLERY.length > 7 && (
                  <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center">
                    <span className="text-white font-black text-xl">+{MAGODO_GALLERY.length - 7}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevLight(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextLight(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <ChevronRight className="w-6 h-6" />
          </button>
          <img src={MAGODO_GALLERY[lightboxIdx].src} alt={MAGODO_GALLERY[lightboxIdx].label}
            className="max-h-[85vh] max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-4 text-gray-400 text-sm">
            {MAGODO_GALLERY[lightboxIdx].label} · {lightboxIdx + 1} / {MAGODO_GALLERY.length}
          </p>
        </div>
      )}

      {/* ── STATUS TABS (navy bar) ── */}
      <div className="bg-navy-900">
        <div className="container-max px-4 md:px-8 flex items-center overflow-x-auto scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const count = tab.id === 'all'
              ? allProjects.length
              : allProjects.filter(p => p.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => handleStatusChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-[3px] flex-shrink-0 ${
                  activeStatus === tab.id
                    ? 'border-gold-500 text-white'
                    : 'border-transparent text-white/40 hover:text-white/80'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 ${
                  activeStatus === tab.id ? 'bg-gold-500/30 text-gold-300' : 'bg-white/10 text-white/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CATEGORY FILTER BAR ── */}
      <div className="bg-white border-b border-gray-200 sticky top-[107px] z-30">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? filtered.length
              : filtered.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'
                }`}
              >
                {cat.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PROJECT GRID ── */}
      <section className="py-16 bg-[#F7F8FA]">
        <div className="container-max px-4 md:px-8">

          {isLoading ? (
            /* Loading skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-white border border-gray-100">
                  <div className="h-60 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>

          ) : filtered.length === 0 ? (
            /* Category has no matching projects */
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium">No projects match this filter.</p>
              <button onClick={() => { setActiveCategory('all'); }}
                className="mt-4 text-sm text-brand-500 hover:underline font-semibold">
                Clear filter
              </button>
            </div>

          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project, i) => {
                const imgs = (() => { try { return JSON.parse(project.images); } catch { return []; } })();
                const src  = project.thumbnail || imgs[0];
                const to   = isShowcase ? '/contact' : `/projects/${project.id}`;

                return (
                  <Link
                    key={project.id}
                    to={to}
                    className={`reveal delay-${Math.min((i % 3 + 1) * 100, 300)} group bg-white overflow-hidden hover:shadow-2xl transition-all duration-300`}
                  >
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      {src ? (
                        <img src={src} alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-4xl font-black text-gray-300 font-heading">SNA</span>
                        </div>
                      )}
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent" />

                      {/* Status badge — top left */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 ${STATUS_BADGE[project.status] || 'bg-white text-gray-700'}`}>
                          {project.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                          {project.status === 'ongoing'   && <Clock className="w-3 h-3" />}
                          {project.status === 'upcoming'  && <Calendar className="w-3 h-3" />}
                          {STATUS_LABEL[project.status] || project.status}
                        </span>
                      </div>

                      {/* Category — top right */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 ${CAT_STYLES[project.category] || 'bg-white/80 text-gray-700'}`}>
                          {project.category}
                        </span>
                      </div>

                      {/* Value — bottom right */}
                      {project.value && (
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-navy-950/80 text-gold-400 text-xs font-black px-2.5 py-1">
                            {project.value}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 border border-t-0 border-gray-100 group-hover:border-navy-900 transition-colors">
                      <h3 className="font-bold text-navy-900 text-base group-hover:text-brand-500 transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 pt-4 border-t border-gray-50 text-xs text-gray-400">
                        {project.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                            {project.location}
                          </span>
                        )}
                        {project.year && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                            {project.year}
                          </span>
                        )}
                        {project.client && (
                          <span className="text-gray-300 hidden xl:inline">· {project.client}</span>
                        )}
                        <span className="ml-auto flex items-center gap-1 text-brand-500 font-semibold group-hover:gap-2 transition-all">
                          {isShowcase ? 'Enquire' : 'View'} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Showcase note */}
          {isShowcase && (
            <p className="text-center text-xs text-gray-300 mt-10">
              Sample portfolio — real projects will appear here once added via the admin panel.
            </p>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-navy-900">
        <div className="container-max px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10 reveal">
          <div>
            <span className="eyebrow-white">Start Your Project</span>
            <h2 className="text-3xl font-black text-white mt-1 font-heading">Want to Build Something Like This?</h2>
            <p className="text-white/40 mt-3 text-lg max-w-lg">
              Every project starts with a conversation. Contact our team for a free, no-obligation consultation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link to="/contact" className="btn-gold whitespace-nowrap">
              Request a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:09060203705" className="btn-outline-white whitespace-nowrap">
              <Phone className="w-4 h-4" /> Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
