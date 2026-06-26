import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Phone, MessageCircle, CheckCircle, Star,
  Award, Shield, Clock, Users, Building2, Hammer,
  HardHat, MapPin, ChevronRight, ChevronLeft, Calendar,
} from 'lucide-react';
import api from '../services/api';
import { Project, Service, Testimonial, SiteSettings } from '../types';

const MAGODO_SLIDES = [
  {
    src: '/images/magodo-project/exterior-2.jpeg',
    label: 'Exterior View',
    desc: 'A stunning white-finished 4-bedroom semi-detached duplex with modern architectural design, black aluminium window frames, and a spacious gated compound with ample parking.',
  },
  {
    src: '/images/magodo-project/living-room.jpeg',
    label: 'Living Room',
    desc: 'The open-plan living area features polished marble flooring, a bespoke ambient LED lighting system, and premium ceiling finishes — creating an elegant atmosphere for entertaining.',
  },
  {
    src: '/images/magodo-project/kitchen-1.jpeg',
    label: 'Modern Kitchen',
    desc: 'A fully fitted contemporary kitchen with black granite countertops, white gloss lower cabinets, warm wood upper cabinets, and a marble-effect backsplash — where style meets function.',
  },
  {
    src: '/images/magodo-project/kitchen-2.jpeg',
    label: 'Kitchen Finish',
    desc: 'Premium kitchen cabinetry and countertop detailing throughout, combining practicality with high-end aesthetics. All appliance spaces pre-fitted for a seamless, clutter-free finish.',
  },
  {
    src: '/images/magodo-project/staircase.jpeg',
    label: 'Feature Staircase',
    desc: 'A dramatic centrepiece staircase with full-height glass balustrade, polished gold handrails, and LED strip lighting illuminating every tread — a true statement of luxury craftsmanship.',
  },
  {
    src: '/images/magodo-project/bedroom.jpeg',
    label: 'Master Bedroom',
    desc: 'Spacious master bedroom with a recessed tray ceiling and integrated LED lighting strips, floor-to-ceiling built-in wardrobes, and continuous marble flooring extending across the upper level.',
  },
  {
    src: '/images/magodo-project/hallway.jpeg',
    label: 'Entrance Hallway',
    desc: 'A grand, wide entrance hallway finished entirely in polished marble, with a solid wood panelled entrance door — setting the tone for the exceptional standard of finish carried throughout the home.',
  },
  {
    src: '/images/magodo-project/living-area-2.jpeg',
    label: 'Lounge Area',
    desc: 'A secondary lounge and entertainment area with LED-lit tray ceilings, feature wall detailing, and marble flooring — a versatile, refined space designed for modern family living.',
  },
];

const SHOWCASE: Project[] = [
  {
    id: 'sc-magodo',
    title: 'Luxury 4-Bedroom Duplex — Magodo',
    description: 'Just-completed luxury 4-bedroom duplex in Magodo, Lagos featuring marble floors, black granite kitchen, glass-and-gold staircase with LED lighting, tray ceilings, and landscaped compound.',
    category: 'residential', location: 'Magodo, Lagos', year: 2026, value: '₦180M',
    images: '["/images/magodo-project/exterior-2.jpeg","/images/magodo-project/kitchen-1.jpeg","/images/magodo-project/kitchen-2.jpeg","/images/magodo-project/living-room.jpeg","/images/magodo-project/staircase.jpeg","/images/magodo-project/bedroom.jpeg","/images/magodo-project/hallway.jpeg","/images/magodo-project/living-area-2.jpeg"]',
    thumbnail: '/images/magodo-project/exterior-2.jpeg',
    featured: true, status: 'completed', createdAt: '2026-06-01',
  },
  {
    id: 'sc1', title: 'Marina Bay Commercial Tower',
    description: 'A 15-floor commercial tower on Victoria Island featuring premium office spaces, ground-floor retail, and rooftop facilities.',
    category: 'commercial', location: 'Victoria Island, Lagos', year: 2023, value: '₦2.8B',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1771457362601-4818d59107d2?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'completed', createdAt: '2023-01-01',
  },
  {
    id: 'sc2', title: 'Ikoyi Heights Luxury Residences',
    description: 'Premium gated residential estate comprising 48 luxury apartments and penthouse units with smart home features.',
    category: 'residential', location: 'Ikoyi, Lagos', year: 2024, value: '₦1.5B',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1763454242946-948f870d730c?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'completed', createdAt: '2024-01-01',
  },
  {
    id: 'sc3', title: 'Lekki Phase II Office Complex',
    description: 'State-of-the-art multi-tenant office complex spanning 22,000sqm in the fast-growing Lekki corridor.',
    category: 'commercial', location: 'Lekki Phase II, Lagos', year: 2025, value: '₦4.2B',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1700469919563-ef267d459da5?auto=format&fit=crop&w=900&q=80',
    featured: true, status: 'ongoing', createdAt: '2024-06-01',
  },
  {
    id: 'sc4', title: 'Abuja Government Secretariat Renovation',
    description: 'Full structural renovation and upgrade of the Federal Government Secretariat complex, Abuja.',
    category: 'government', location: 'Central Area, Abuja', year: 2025, value: '₦850M',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1630254428244-ac29b798067f?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'ongoing', createdAt: '2024-09-01',
  },
  {
    id: 'sc5', title: 'Eko Atlantic Mixed-Use Tower',
    description: 'Landmark 30-floor mixed-use tower on Eko Atlantic City: luxury residential, premium office and retail podium.',
    category: 'commercial', location: 'Eko Atlantic City, Lagos', year: 2026, value: '₦6.5B',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1621355254187-22a61da5ec52?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'upcoming', createdAt: '2025-01-01',
  },
  {
    id: 'sc6', title: 'Gbagada Residential Estate Phase 3',
    description: 'Third phase of the award-winning Gbagada Estate — 120 mid-range residential units with integrated amenities.',
    category: 'residential', location: 'Gbagada, Lagos', year: 2026, value: '₦2.1B',
    images: '[]', thumbnail: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
    featured: false, status: 'upcoming', createdAt: '2025-03-01',
  },
];

const IMG = {
  hero:    '/images/magodo-project/exterior-2.jpeg',
  about:   'https://images.unsplash.com/photo-1602497485099-e41a116a272c?auto=format&fit=crop&w=900&q=80',
  process: 'https://images.unsplash.com/photo-1700469919563-ef267d459da5?auto=format&fit=crop&w=1920&q=80',
  cta:     'https://images.unsplash.com/photo-1771457362601-4818d59107d2?auto=format&fit=crop&w=900&q=80',
  fallback:'https://images.unsplash.com/photo-1765378025221-3ed7eadc6def?auto=format&fit=crop&w=900&q=80',
};

const CAT_PILL: Record<string, string> = {
  residential:    'bg-emerald-100/90 text-emerald-800',
  commercial:     'bg-sky-100/90 text-sky-800',
  government:     'bg-violet-100/90 text-violet-800',
  infrastructure: 'bg-amber-100/90 text-amber-800',
  industrial:     'bg-orange-100/90 text-orange-800',
};

const CLIENTS = [
  'Federal Ministry of Works',
  'Lagos State Government',
  'Dangote Group',
  'MTN Nigeria',
  'Access Bank Plc',
  'Julius Berger',
  'Nestlé Nigeria',
  'NNPC Limited',
  'Flour Mills of Nigeria',
  'Zenith Bank Plc',
];

const SERVICES_ICONS = [
  { icon: <Building2 className="w-7 h-7" />, label: 'Building Construction' },
  { icon: <Hammer className="w-7 h-7" />, label: 'Renovation & Remodeling' },
  { icon: <HardHat className="w-7 h-7" />, label: 'Civil Engineering' },
  { icon: <Award className="w-7 h-7" />, label: 'Project Management' },
  { icon: <Shield className="w-7 h-7" />, label: 'Structural Engineering' },
  { icon: <Clock className="w-7 h-7" />, label: 'Facilities Management' },
];

export function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = useCallback(() => setActiveSlide(i => (i + 1) % MAGODO_SLIDES.length), []);
  const prevSlide = () => setActiveSlide(i => (i - 1 + MAGODO_SLIDES.length) % MAGODO_SLIDES.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(nextSlide, 4500);
    return () => clearInterval(t);
  }, [paused, nextSlide]);

  const { data: settings } = useQuery<SiteSettings>({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ['services'], queryFn: () => api.get('/services').then(r => r.data) });
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['projects', 'featured'], queryFn: () => api.get('/projects?featured=true').then(r => r.data) });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ['testimonials'], queryFn: () => api.get('/testimonials').then(r => r.data) });

  const tickerItems = [...CLIENTS, ...CLIENTS];

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          01 HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <img src={IMG.hero} alt="SNA Construction" className="absolute inset-0 w-full h-full object-cover scale-105" />
        {/* Navy overlay — heavier on left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/97 via-navy-900/88 to-navy-900/60" />
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-500" />

        <div className="relative container-max px-4 md:px-8 pt-44 pb-40 w-full">
          <div className="max-w-3xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 mb-8 border border-white/15 px-4 py-2.5 bg-white/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/70 uppercase tracking-[0.2em] font-medium">Now Accepting Projects · Lagos, Nigeria</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.02] tracking-tight">
              Engineering<br />
              <span style={{ color: 'var(--gold-400)' }}>Excellence.</span><br />
              Building Nigeria.
            </h1>

            <p className="mt-7 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl font-light">
              A full-service building and civil engineering construction company delivering world-class projects across Lagos and West Africa since 2009.
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8">
              {['COREN Certified', 'ISO 9001:2015', 'NIA Member', 'NIQS Registered'].map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-white/50">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold-400)' }} />
                  {c}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link to="/projects" className="btn-gold text-sm px-8 py-4">
                Explore Our Projects <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-outline-white text-sm px-8 py-4">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar — sits at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-navy-950/80 backdrop-blur-sm">
          <div className="container-max px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {[
              { value: settings?.projects_completed || '250', suffix: '+', label: 'Projects Delivered' },
              { value: settings?.years_experience   || '15',  suffix: '+', label: 'Years Experience' },
              { value: settings?.happy_clients      || '180', suffix: '+', label: 'Satisfied Clients' },
              { value: settings?.expert_staff       || '60',  suffix: '+', label: 'Expert Engineers' },
            ].map((s) => (
              <div key={s.label} className="text-center py-6 px-4">
                <p className="text-3xl md:text-4xl font-black text-white">{s.value}<span style={{ color: 'var(--gold-400)' }}>{s.suffix}</span></p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          01B FEATURED PROJECT SLIDER — Magodo Duplex
      ══════════════════════════════════════════════ */}
      <section
        className="relative h-[75vh] min-h-[520px] overflow-hidden bg-navy-950"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        {MAGODO_SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img
              src={slide.src}
              alt={slide.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-navy-950/10" />
          </div>
        ))}

        {/* "Just Completed" ribbon */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-6 z-10">
          <div className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
            <CheckCircle className="w-3.5 h-3.5" />
            Just Completed &nbsp;·&nbsp; Magodo, Lagos &nbsp;·&nbsp; 2026
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 pt-20 bg-gradient-to-t from-navy-950/90 to-transparent">
          <div className="container-max px-4 md:px-8">
            <div className="max-w-3xl">
              {/* Project title */}
              <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                {MAGODO_SLIDES[activeSlide].label}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                Luxury 4-Bedroom Duplex<br />
                <span className="text-gold-400">Magodo, Lagos</span>
              </h2>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                {MAGODO_SLIDES[activeSlide].desc}
              </p>
              <Link
                to="/projects?status=completed"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-3 text-sm uppercase tracking-wider transition-colors"
              >
                View All Photos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
          {MAGODO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeSlide ? 'w-6 h-2.5 bg-gold-500' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
          <div
            key={activeSlide}
            className="h-full bg-gold-500"
            style={{ animation: paused ? 'none' : 'slideProgress 4.5s linear forwards' }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          02 CLIENTS TICKER
      ══════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-b border-gray-100">
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-[0.25em] font-semibold mb-6 reveal">
          Trusted by Nigeria's leading organisations
        </p>
        <div className="overflow-hidden">
          <div className="ticker-track">
            {tickerItems.map((name, i) => (
              <span key={i} className="inline-flex items-center gap-3 mx-10 text-sm font-semibold text-gray-400 hover:text-navy-900 transition-colors whitespace-nowrap cursor-default">
                <span className="w-1 h-1 rounded-full bg-gold-400" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          03 ABOUT
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="container-max px-4 md:px-8 grid lg:grid-cols-2 gap-20 items-center">

          {/* Image side */}
          <div className="relative reveal-left">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={IMG.about} alt="SNA Construction engineers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-8 -right-6 bg-navy-900 text-white p-6 shadow-2xl w-48 text-center">
              <p className="text-5xl font-black text-gold-400">{settings?.projects_completed || '250'}<span className="text-2xl">+</span></p>
              <p className="text-xs text-white/50 mt-1.5 uppercase tracking-widest">Projects<br />Completed</p>
            </div>
            <div className="absolute -top-6 -left-6 bg-gold-500 text-white p-5 shadow-xl">
              <p className="text-3xl font-black">{settings?.years_experience || '15'}+</p>
              <p className="text-xs text-white/80 uppercase tracking-wider mt-1">Years of<br />Excellence</p>
            </div>
          </div>

          {/* Text side */}
          <div className="reveal-right">
            <span className="eyebrow">About SNA Construction</span>
            <h2 className="section-heading">
              Building Nigeria's Future with Precision & Integrity
            </h2>
            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              {settings?.about_short || 'SNA Construction Limited is a full-service building and civil engineering construction company operating from our headquarters in Ikeja, Lagos.'}
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed">
              With {settings?.years_experience || '15'}+ years of experience, we combine certified engineering expertise with modern construction management to deliver projects that stand the test of time — on budget, on schedule.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-10">
              {[
                { icon: <Award className="w-5 h-5" />, title: 'COREN Certified', desc: 'Registered engineers, national standards' },
                { icon: <Shield className="w-5 h-5" />, title: 'ISO 9001:2015', desc: 'Quality management certified' },
                { icon: <Clock className="w-5 h-5" />, title: 'On-Time Delivery', desc: 'Consistent project management' },
                { icon: <Users className="w-5 h-5" />, title: '60+ Engineers', desc: 'Skilled in-house team' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 border border-gray-100 hover:border-brand-300 transition-colors group">
                  <div className="w-10 h-10 bg-navy-50 flex items-center justify-center flex-shrink-0 text-navy-900 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link to="/about" className="btn-navy">
                Our Story <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-outline-navy">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          04 SERVICES
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#F7F8FA]">
        <div className="container-max px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16 mb-16">
            <div className="lg:col-span-1 reveal">
              <span className="eyebrow">What We Do</span>
              <h2 className="section-heading">Our Core Services</h2>
              <p className="section-lead">
                Full-spectrum construction and engineering services, executed by certified professionals.
              </p>
              <Link to="/services" className="btn-navy mt-8">
                All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(services.length > 0 ? services : SERVICES_ICONS.map((s, i) => ({ id: String(i), title: s.label, description: '', image: '', features: '[]', order: i } as Service))).slice(0, 6).map((service, i) => (
                <Link
                  key={service.id}
                  to="/services"
                  className={`reveal delay-${Math.min((i % 3 + 1) * 100, 300)} group flex gap-5 p-6 bg-white border border-gray-100 hover:border-navy-900 hover:shadow-xl transition-all duration-300`}
                >
                  {/* Image or icon */}
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-50 group-hover:bg-navy-900 transition-colors">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        {SERVICES_ICONS[i]?.icon || <Building2 className="w-6 h-6" />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy-900 text-sm leading-snug group-hover:text-brand-500 transition-colors">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{service.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-brand-500 text-xs font-semibold mt-3 group-hover:gap-2 transition-all">
                      Learn more <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          05 PROJECTS
      ══════════════════════════════════════════════ */}
      {(() => {
        const display = projects.length > 0 ? projects : SHOWCASE;
        const completed = display.filter(p => p.status === 'completed');
        const ongoing   = display.filter(p => p.status === 'ongoing');
        const upcoming  = display.filter(p => p.status === 'upcoming');

        const ProjectCard = ({ project, large = false }: { project: Project; large?: boolean }) => {
          const imgs = (() => { try { return JSON.parse(project.images); } catch { return []; } })();
          const src = project.thumbnail || imgs[0] || IMG.fallback;
          const dest = projects.length > 0 ? `/projects/${project.id}` : '/projects';
          const statusBadge = project.status === 'completed'
            ? 'bg-emerald-500 text-white'
            : project.status === 'ongoing'
            ? 'bg-amber-500 text-white'
            : 'bg-sky-500 text-white';
          return (
            <Link to={dest}
              className={`group relative overflow-hidden block ${large ? 'h-[420px] lg:h-[500px]' : 'h-[240px]'}`}>
              <img src={src} alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${CAT_PILL[project.category] || 'bg-white/80 text-gray-800'}`}>
                  {project.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${statusBadge}`}>
                  {project.status}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
                <h3 className={`font-black text-white group-hover:text-gold-400 transition-colors leading-tight ${large ? 'text-2xl' : 'text-base'}`}>
                  {project.title}
                </h3>
                {large && <p className="text-white/50 text-sm mt-2 line-clamp-2">{project.description}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-white/50">
                  {project.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gold-400" />{project.location}</span>}
                  {project.value && <span className="text-gold-400 font-bold">{project.value}</span>}
                </div>
                {large && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-white/60 font-semibold uppercase tracking-wider group-hover:text-gold-400 transition-colors">
                    View Project <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </Link>
          );
        };

        return (
          <section className="py-28 bg-white">
            <div className="container-max px-4 md:px-8">
              {/* Section header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div className="reveal">
                  <span className="eyebrow">Our Portfolio</span>
                  <h2 className="section-heading">Our Projects</h2>
                  <p className="section-lead max-w-xl">
                    Over {settings?.projects_completed || '250'}+ projects delivered across Nigeria — from residential homes to government infrastructure.
                  </p>
                </div>
                <Link to="/projects" className="btn-outline-navy flex-shrink-0 reveal delay-200">
                  View Full Portfolio <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* ── COMPLETED ── */}
              {completed.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center justify-between mb-6 reveal">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-emerald-700 uppercase tracking-[0.15em]">
                        Completed Projects — {completed.length} delivered
                      </span>
                    </div>
                    <Link to="/projects?status=completed"
                      className="text-xs font-semibold text-gray-400 hover:text-navy-900 flex items-center gap-1 transition-colors">
                      See all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7 reveal reveal-left">
                      <ProjectCard project={completed[0]} large />
                    </div>
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      {completed.slice(1, 3).map((p, i) => (
                        <div key={p.id} className={`reveal delay-${(i + 1) * 150} flex-1`}>
                          <ProjectCard project={p} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── ONGOING ── */}
              {ongoing.length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center justify-between mb-6 reveal">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700 uppercase tracking-[0.15em]">
                        Ongoing Projects — {ongoing.length} in progress
                      </span>
                    </div>
                    <Link to="/projects?status=ongoing"
                      className="text-xs font-semibold text-gray-400 hover:text-navy-900 flex items-center gap-1 transition-colors">
                      See all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ongoing.slice(0, 2).map((p, i) => (
                      <div key={p.id} className={`reveal delay-${i * 150}`}>
                        <ProjectCard project={p} large />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── UPCOMING ── */}
              {upcoming.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6 reveal">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-sky-500" />
                      <span className="text-sm font-bold text-sky-700 uppercase tracking-[0.15em]">
                        Upcoming Projects — {upcoming.length} starting soon
                      </span>
                    </div>
                    <Link to="/projects?status=upcoming"
                      className="text-xs font-semibold text-gray-400 hover:text-navy-900 flex items-center gap-1 transition-colors">
                      See all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcoming.slice(0, 2).map((p, i) => (
                      <div key={p.id} className={`reveal delay-${i * 100}`}>
                        <ProjectCard project={p} />
                      </div>
                    ))}
                    {/* CTA card */}
                    <Link to="/contact"
                      className="reveal delay-200 group relative overflow-hidden h-[240px] bg-navy-900 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-14 h-14 border border-gold-500/40 flex items-center justify-center mb-4 group-hover:border-gold-400 transition-colors">
                        <Building2 className="w-6 h-6 text-gold-400" />
                      </div>
                      <p className="text-white font-bold text-base">Have a Project in Mind?</p>
                      <p className="text-white/40 text-sm mt-2">Talk to our team today</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-gold-400 font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                        Get a Free Quote <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}


      {/* ══════════════════════════════════════════════
          06 NUMBERS (dark navy)
      ══════════════════════════════════════════════ */}
      <section className="py-28 bg-navy-900">
        <div className="container-max px-4 md:px-8">
          <div className="text-center mb-16 reveal">
            <span className="eyebrow-white">Our Numbers</span>
            <h2 className="section-heading-white">
              A Track Record That<br />Speaks for Itself
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {[
              { value: settings?.projects_completed || '250', suffix: '+', label: 'Projects Completed', sub: 'Across residential, commercial & infrastructure' },
              { value: settings?.years_experience   || '15',  suffix: '+', label: 'Years of Experience', sub: 'Building excellence since 2009' },
              { value: settings?.happy_clients      || '180', suffix: '+', label: 'Satisfied Clients',   sub: 'Government, corporate & private' },
              { value: '100',                                 suffix: '%', label: 'On-Time Delivery',    sub: 'Rigorous project management' },
            ].map((s) => (
              <div key={s.label} className="reveal bg-navy-900 p-10 text-center group hover:bg-navy-800 transition-colors">
                <p className="text-5xl md:text-6xl font-black text-white">
                  {s.value}<span className="text-gold-400">{s.suffix}</span>
                </p>
                <p className="text-sm font-bold text-white/70 mt-3 uppercase tracking-wider">{s.label}</p>
                <p className="text-xs text-white/30 mt-2 leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          07 PROCESS
      ══════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <img src={IMG.process} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/95" />
        <div className="relative container-max px-4 md:px-8">
          <div className="text-center mb-16 reveal">
            <span className="eyebrow-white">How We Work</span>
            <h2 className="section-heading-white">Simple. Transparent. Delivered.</h2>
            <p className="section-lead-white max-w-xl mx-auto">
              From your first call to project handover — our process is designed for clarity and confidence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Horizontal connector (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-white/10 z-0" />

            {[
              { n: '01', title: 'Free Consultation', body: 'We listen to your vision, assess site conditions, and provide expert guidance — with no cost or obligation.' },
              { n: '02', title: 'Design & Planning', body: 'Our COREN engineers and architects produce detailed drawings, structural calculations, and cost estimates.' },
              { n: '03', title: 'Construction',      body: 'Our skilled team builds with premium materials, providing regular site reports and photographic updates.' },
              { n: '04', title: 'Handover & Warranty', body: 'Full sign-off, structural inspection, and a comprehensive 5-year warranty on all completed works.' },
            ].map((s, i) => (
              <div key={s.n}
                className={`reveal delay-${(i + 1) * 100} relative z-10 border border-white/8 p-8 group hover:border-gold-400/40 hover:bg-white/4 transition-all`}>
                <div className="text-5xl font-black text-white/10 group-hover:text-gold-400/20 transition-colors mb-6 leading-none">
                  {s.n}
                </div>
                <div className="w-10 h-10 bg-gold-500 flex items-center justify-center mb-6 text-white font-black text-sm">
                  {s.n}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14 reveal">
            <Link to="/contact" className="btn-gold text-sm px-10 py-4">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          08 TESTIMONIALS
      ══════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-28 bg-[#F7F8FA]">
          <div className="container-max px-4 md:px-8">
            <div className="text-center mb-14 reveal">
              <span className="eyebrow">Client Reviews</span>
              <h2 className="section-heading">What Our Clients Say</h2>
            </div>

            {/* Featured */}
            {testimonials[0] && (
              <div className="reveal grid lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-navy-900 p-10 md:p-12">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonials[0].rating }).map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-light text-white/90 leading-relaxed italic">
                    "{testimonials[0].text}"
                  </blockquote>
                  <div className="flex items-center gap-4 mt-10 pt-8 border-t border-white/10">
                    <div className="w-12 h-12 bg-gold-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {testimonials[0].name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-bold">{testimonials[0].name}</p>
                      <p className="text-white/40 text-sm mt-0.5">{testimonials[0].role}{testimonials[0].company ? `, ${testimonials[0].company}` : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Why choose us quick list */}
                <div className="bg-brand-500 p-8 flex flex-col justify-center">
                  <h3 className="text-white font-black text-xl mb-6 leading-snug">Why Clients Choose SNA</h3>
                  <ul className="space-y-4">
                    {[
                      'Free initial consultation',
                      'COREN certified engineers',
                      '48-hour cost estimate',
                      '5-year structural warranty',
                      'Transparent billing',
                      'On-time completion guarantee',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-gold-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="mt-8 btn-gold w-full justify-center text-sm">
                    Get a Free Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Grid */}
            {testimonials.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.slice(1, 4).map((t, i) => (
                  <div key={t.id}
                    className={`reveal delay-${(i + 1) * 100} bg-white border border-gray-100 p-6 hover:border-navy-900 hover:shadow-lg transition-all duration-300`}>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-50">
                      <div className="w-9 h-9 bg-navy-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-navy-900 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════
          09 CTA (split layout)
      ══════════════════════════════════════════════ */}
      <section className="grid lg:grid-cols-2 min-h-[480px]">
        {/* Left — text */}
        <div className="bg-brand-500 flex items-center px-8 md:px-16 py-20 reveal">
          <div>
            <span className="eyebrow-white">Ready to Build?</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 leading-tight">
              Let's Create<br />Something<br /><span className="text-gold-300">Extraordinary.</span>
            </h2>
            <p className="text-blue-100 mt-5 leading-relaxed text-lg max-w-md">
              Contact our team for a free, no-obligation consultation. We'll review your project and provide a detailed plan and estimate within 48 hours.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/contact" className="btn-gold">
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={`tel:${settings?.phone || '09060203705'}`} className="btn-outline-white">
                <Phone className="w-4 h-4" /> Call Us
              </a>
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-4 transition-all text-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {['Free Consultation', '100% Certified', '5-Year Warranty', 'On-Time Guarantee'].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-blue-200 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-300" /> {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[400px] reveal-right">
          <img src={IMG.cta} alt="SNA Construction project" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy-950/30" />
          <div className="absolute bottom-6 left-6 right-6 bg-navy-950/80 backdrop-blur-sm px-6 py-5">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Head Office</p>
            <p className="text-white font-semibold text-sm">{settings?.address || 'Wuraola House, 90 Allen Ave, Ikeja, Lagos, Nigeria'}</p>
            <p className="text-white/50 text-xs mt-2">{settings?.phone || '09060203705'} · {settings?.email || 'sna.constructions@outlook.com'}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
