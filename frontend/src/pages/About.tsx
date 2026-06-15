import { useQuery } from '@tanstack/react-query';
import { Award, Shield, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SiteSettings, TeamMember } from '../types';

const IMG = {
  hero:   'https://images.unsplash.com/photo-1741023705492-48561fc75bab?auto=format&fit=crop&w=1920&q=90',
  story:  'https://images.unsplash.com/photo-1640475167390-619167cd944d?auto=format&fit=crop&w=900&q=80',
  values: 'https://images.unsplash.com/photo-1763454242946-948f870d730c?auto=format&fit=crop&w=1920&q=80',
};

export function About() {
  const { data: settings } = useQuery<SiteSettings>({ queryKey: ['settings'], queryFn: () => api.get('/settings').then(r => r.data) });
  const { data: team = [] } = useQuery<TeamMember[]>({ queryKey: ['team'], queryFn: () => api.get('/team').then(r => r.data) });

  const certifications = [
    'COREN Registered Engineers',
    'Nigeria Institute of Architects (NIA)',
    'Nigerian Institute of Quantity Surveyors (NIQS)',
    'Federal Ministry of Works Registered',
    'ISO 9001:2015 Quality Management',
    'Lagos State Ministry of Environment Certified',
  ];

  return (
    <div className="pt-[107px]">
      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-[440px] flex items-center overflow-hidden">
        <img src={IMG.hero} alt="SNA Construction" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/40" />
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gold-500" />
        <div className="relative container-max px-4 md:px-8">
          <span className="eyebrow-white reveal">Our Company</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mt-1 reveal delay-100">
            About SNA<br />Construction
          </h1>
          <p className="text-white/50 text-lg mt-4 max-w-xl reveal delay-200">
            Over {settings?.years_experience || '15'} years of engineering excellence and construction innovation across Nigeria
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-navy-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-navy-900 font-semibold">About Us</span>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section className="py-28 bg-white">
        <div className="container-max px-4 md:px-8 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative reveal-left">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={IMG.story} alt="SNA engineers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-8 -right-6 bg-navy-900 text-white p-6 shadow-2xl w-44 text-center">
              <p className="text-4xl font-black text-gold-400">{settings?.projects_completed || '250'}<span className="text-2xl">+</span></p>
              <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">Projects<br />Delivered</p>
            </div>
          </div>

          <div className="reveal-right">
            <span className="eyebrow">Who We Are</span>
            <h2 className="section-heading">Nigeria's Premier<br />Construction Company</h2>
            <div className="mt-6 space-y-4 text-gray-500 leading-relaxed">
              <p>{settings?.about_full || 'SNA Construction Limited has established itself as a trusted name in building excellence over more than 15 years. From residential homes to large-scale commercial complexes, we bring your vision to life with precision, quality, and integrity.'}</p>
              <p>Founded on the belief that every construction project deserves the highest level of professionalism and craftsmanship, we have successfully delivered hundreds of projects across Nigeria from our headquarters in Ikeja, Lagos.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-10">
              {[
                ['Founded', '2009'],
                ['HQ', 'Ikeja, Lagos'],
                ['Projects', `${settings?.projects_completed || '250'}+`],
                ['Engineers', `${settings?.expert_staff || '60'}+`],
              ].map(([label, val]) => (
                <div key={label} className="border border-gray-100 p-5">
                  <p className="text-3xl font-black text-navy-900">{val}</p>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mt-8">
              {[
                { label: 'Mission', text: 'To deliver superior construction services that exceed expectations through innovation, quality, and professional excellence.' },
                { label: 'Vision',  text: "To be West Africa's most trusted construction company, recognised for quality, safety, and sustainable development." },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-5 border-l-2 border-gold-500 bg-gray-50">
                  <div>
                    <p className="font-bold text-navy-900 text-sm uppercase tracking-wide">{item.label}</p>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="relative py-28 overflow-hidden">
        <img src={IMG.values} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-950/95" />
        <div className="relative container-max px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow-white reveal mx-auto">What Drives Us</span>
            <h2 className="section-heading-white mt-1 reveal delay-100">Our Core Values</h2>
            <p className="section-lead-white max-w-xl mx-auto reveal delay-200">The principles that guide every decision, from first consultation to project handover</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Award className="w-6 h-6" />, title: 'Excellence', desc: 'We pursue the highest standards in every project, from design to delivery and beyond.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Integrity',  desc: 'Honesty and transparency are at the foundation of every client relationship we build.' },
              { icon: <Clock className="w-6 h-6" />, title: 'Reliability', desc: 'On-time, on-budget delivery is not a promise — it is our consistent track record.' },
              { icon: <Users className="w-6 h-6" />, title: 'Teamwork',    desc: 'Deep collaboration with clients and our in-house team produces the best results.' },
            ].map((v, i) => (
              <div key={v.title}
                className={`reveal delay-${(i + 1) * 100} border border-white/8 p-8 group hover:border-gold-400/50 hover:bg-white/4 transition-all text-center`}>
                <div className="w-14 h-14 bg-gold-500 flex items-center justify-center text-white mx-auto mb-5">
                  {v.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      {team.length > 0 && (
        <section className="py-28 bg-white">
          <div className="container-max px-4 md:px-8">
            <div className="text-center mb-14">
              <span className="eyebrow reveal mx-auto">The People Behind SNA</span>
              <h2 className="section-heading reveal delay-100">Our Leadership Team</h2>
              <p className="section-lead mx-auto text-center max-w-xl reveal delay-200">Experienced professionals dedicated to delivering exceptional results on every project</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div key={member.id}
                  className={`reveal delay-${Math.min((i % 3 + 1) * 100, 300)} group border border-gray-100 hover:border-navy-900 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                  <div className="relative h-72 overflow-hidden bg-gray-50">
                    {member.image ? (
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-navy-50">
                        <span className="text-5xl font-black text-navy-200">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy-900">{member.name}</h3>
                    <p className="text-gold-500 text-sm font-semibold mt-0.5">{member.role}</p>
                    {member.bio && <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{member.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      <section className="py-28 bg-[#F7F8FA]">
        <div className="container-max px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow reveal mx-auto">Credentials</span>
            <h2 className="section-heading reveal delay-100">Certifications & Memberships</h2>
            <p className="section-lead mx-auto text-center reveal delay-200">Fully accredited by all major professional bodies in Nigeria</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <div key={cert}
                className={`reveal delay-${Math.min((i % 3 + 1) * 100, 300)} flex items-center gap-4 p-5 bg-white border border-gray-100 hover:border-navy-900 hover:shadow-md transition-all`}>
                <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-sm text-navy-900 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-navy-900">
        <div className="container-max px-4 md:px-8 text-center reveal">
          <span className="eyebrow-white mx-auto">Work With Us</span>
          <h2 className="section-heading-white mt-1">Ready to Build Together?</h2>
          <p className="section-lead-white max-w-xl mx-auto">Contact our team today for a free consultation on your next project.</p>
          <Link to="/contact" className="btn-gold mt-8 inline-flex text-sm">
            Contact Us Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
