import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Clock,
  User, Building2, ChevronLeft, ChevronRight, X, ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { Project } from '../types';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  ongoing:   'bg-amber-100 text-amber-700 border border-amber-200',
  upcoming:  'bg-blue-100 text-blue-700 border border-blue-200',
};

const CAT_STYLES: Record<string, string> = {
  residential:    'bg-emerald-100 text-emerald-700',
  commercial:     'bg-blue-100 text-blue-700',
  government:     'bg-purple-100 text-purple-700',
  infrastructure: 'bg-amber-100 text-amber-700',
  industrial:     'bg-orange-100 text-orange-700',
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`).then((r) => r.data),
  });

  const { data: related = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then((r) => r.data),
    select: (data) => data.filter((p) => p.id !== id && p.category === project?.category).slice(0, 3),
    enabled: !!project,
  });

  if (isLoading) {
    return (
      <div className="pt-[108px] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-[108px] min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Building2 className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 font-medium">Project not found.</p>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  const images = (() => { try { return JSON.parse(project.images); } catch { return []; } })();
  const allImages = project.thumbnail
    ? [project.thumbnail, ...images.filter((i: string) => i !== project.thumbnail)]
    : images;

  const openLightbox = (img: string, idx: number) => { setLightboxImg(img); setLightboxIdx(idx); };
  const closeLightbox = () => setLightboxImg(null);
  const prevImg = () => { const i = (lightboxIdx - 1 + allImages.length) % allImages.length; setLightboxIdx(i); setLightboxImg(allImages[i]); };
  const nextImg = () => { const i = (lightboxIdx + 1) % allImages.length; setLightboxIdx(i); setLightboxImg(allImages[i]); };

  return (
    <div className="pt-[108px]">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-max px-4 md:px-8 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-brand-500 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{project.title}</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative h-72 md:h-[480px] bg-gray-100 overflow-hidden">
        {allImages[0] ? (
          <img src={allImages[0]} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Building2 className="w-24 h-24 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container-max px-4 md:px-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[project.status] || ''}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CAT_STYLES[project.category] || 'bg-gray-100 text-gray-700'}`}>
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{project.title}</h1>
            {project.location && (
              <p className="text-gray-300 flex items-center gap-1.5 mt-2 text-sm">
                <MapPin className="w-4 h-4" /> {project.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 bg-white">
        <div className="container-max px-4 md:px-8 grid lg:grid-cols-3 gap-12">

          {/* Content column */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
            </div>

            {/* Gallery */}
            {allImages.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(img, i)}
                      className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 hover:opacity-95 transition-all group shadow-sm hover:shadow-md"
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full transition-opacity">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to All Projects
            </Link>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Project details card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Project Details</h3>
              {[
                project.client && { icon: <User className="w-4 h-4 text-brand-500" />, label: 'Client', value: project.client },
                project.location && { icon: <MapPin className="w-4 h-4 text-brand-500" />, label: 'Location', value: project.location },
                project.year && { icon: <Calendar className="w-4 h-4 text-brand-500" />, label: 'Year Completed', value: String(project.year) },
                project.duration && { icon: <Clock className="w-4 h-4 text-brand-500" />, label: 'Duration', value: project.duration },
                project.value && { icon: <DollarSign className="w-4 h-4 text-gold-600" />, label: 'Project Value', value: project.value },
                { icon: <Building2 className="w-4 h-4 text-brand-500" />, label: 'Category', value: project.category.charAt(0).toUpperCase() + project.category.slice(1) },
              ].filter(Boolean).map((item: any) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-gray-900 font-semibold mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div className="bg-brand-500 rounded-2xl p-6 text-center">
              <h4 className="font-bold text-white text-lg">Like What You See?</h4>
              <p className="text-blue-100 text-sm mt-1">Start a similar project with SNA Construction today.</p>
              <Link to="/contact" className="btn-gold mt-4 w-full justify-center text-sm">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-max px-4 md:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => {
                const imgs = (() => { try { return JSON.parse(p.images); } catch { return []; } })();
                return (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="h-44 bg-gray-100 overflow-hidden">
                      {p.thumbnail || imgs[0] ? (
                        <img src={p.thumbnail || imgs[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-500 transition-colors">{p.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{p.location} · {p.year}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" onClick={closeLightbox}>
            <X className="w-5 h-5" />
          </button>
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <img src={lightboxImg} alt="" className="max-h-[85vh] max-w-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-4 text-gray-400 text-sm">{lightboxIdx + 1} / {allImages.length}</p>
        </div>
      )}
    </div>
  );
}
