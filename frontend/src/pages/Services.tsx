import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Phone } from 'lucide-react';
import api from '../services/api';
import { Service } from '../types';

const HERO_IMG  = 'https://images.unsplash.com/photo-1700469919563-ef267d459da5?auto=format&fit=crop&w=1920&q=85';
const FALLBACK  = 'https://images.unsplash.com/photo-1722079358008-2c72a8973998?auto=format&fit=crop&w=900&q=80';

const WHY = [
  { icon: '🏅', title: 'COREN Certified Engineers',  desc: 'Every project supervised by registered COREN engineers ensuring full compliance with Nigerian standards.' },
  { icon: '📐', title: 'Precise Engineering',         desc: 'Latest engineering software and methodologies for structural integrity and precision in every build.' },
  { icon: '💰', title: 'Transparent Pricing',         desc: 'Detailed cost breakdowns with zero hidden charges — you know exactly what you pay from day one.' },
  { icon: '⏰', title: 'On-Time Delivery',            desc: 'Proven project management ensures your project is delivered on schedule, every time.' },
  { icon: '🔒', title: '5-Year Warranty',             desc: 'Comprehensive 5-year structural warranty on all completed projects.' },
  { icon: '🤝', title: 'Dedicated Support',           desc: 'A dedicated project manager keeps you informed and available throughout the entire build.' },
];

export function Services() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data),
  });

  return (
    <div className="pt-[107px]">
      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="Services" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-500" />
        <div className="relative container-max px-4 md:px-8">
          <span className="eyebrow-white reveal">What We Offer</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mt-1 reveal delay-100">Our Services</h1>
          <p className="text-white/50 text-lg mt-4 max-w-xl reveal delay-200">
            Comprehensive construction and engineering solutions delivered with precision and expertise
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-navy-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold">Services</span>
        </div>
      </div>

      {/* ── SERVICE LIST ── */}
      <section className="py-24 bg-white">
        <div className="container-max px-4 md:px-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1,2,3].map(i => <div key={i} className="h-72 animate-pulse bg-gray-100" />)}
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service, index) => {
                const features = (() => { try { return JSON.parse(service.features); } catch { return []; } })();
                const isEven = index % 2 === 0;
                return (
                  <div key={service.id}
                    className={`reveal grid lg:grid-cols-2 border border-gray-100 hover:border-navy-900 hover:shadow-xl transition-all duration-300 group overflow-hidden`}>
                    {/* Image */}
                    <div className={`relative h-64 lg:h-auto overflow-hidden bg-gray-100 ${!isEven ? 'lg:order-last' : ''}`}>
                      <img
                        src={service.image || FALLBACK}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/10 transition-colors" />
                      <div className={`absolute bottom-4 ${isEven ? 'right-4' : 'left-4'} bg-gold-500 text-white text-sm font-black px-3 py-2 min-w-[3rem] text-center`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`p-8 lg:p-12 flex flex-col justify-center ${isEven ? 'bg-white' : 'bg-[#F7F8FA]'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-8 h-[2px] bg-gold-500" />
                        <span className="text-[11px] text-gold-600 font-semibold uppercase tracking-[0.15em]">Service {String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <h2 className="text-2xl font-black text-navy-900">{service.title}</h2>
                      <p className="text-gray-500 mt-4 leading-relaxed">{service.description}</p>

                      {features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-7">
                          {features.map((f: string) => (
                            <div key={f} className="flex items-center gap-2.5">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                        <Link to="/contact" className="btn-navy text-sm py-3 px-6">
                          Enquire Now <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/projects" className="btn-outline-navy text-sm py-3 px-6">
                          See Projects
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 bg-[#F7F8FA]">
        <div className="container-max px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow reveal mx-auto">Why Choose SNA</span>
            <h2 className="section-heading reveal delay-100">The SNA Difference</h2>
            <p className="section-lead mx-auto text-center max-w-xl reveal delay-200">
              We don't just build structures — we build lasting relationships and enduring quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY.map((item, i) => (
              <div key={item.title}
                className={`reveal delay-${Math.min((i % 3 + 1) * 100, 300)} bg-white border border-gray-100 p-7 hover:border-navy-900 hover:shadow-lg transition-all duration-300 group`}>
                <div className="text-3xl mb-5">{item.icon}</div>
                <h3 className="font-bold text-navy-900 text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy-900 py-24">
        <div className="container-max px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10 reveal">
          <div>
            <span className="eyebrow-white">Get Expert Advice</span>
            <h2 className="text-3xl font-black text-white mt-1">Not Sure What You Need?</h2>
            <p className="text-white/40 mt-3 text-lg max-w-xl">
              Our expert team will assess your project and recommend the best solution. Free and no obligation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link to="/contact" className="btn-gold whitespace-nowrap">
              Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href={`tel:${'+2348027672448'}`} className="btn-outline-white whitespace-nowrap">
              <Phone className="w-4 h-4" /> Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
