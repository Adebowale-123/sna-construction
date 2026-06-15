export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  year?: number;
  client?: string;
  value?: string;
  duration?: string;
  images: string;
  thumbnail?: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features: string;
  image?: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  text: string;
  rating: number;
  image?: string;
  featured: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SiteSettings {
  company_name?: string;
  tagline?: string;
  about_short?: string;
  about_full?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  years_experience?: string;
  projects_completed?: string;
  happy_clients?: string;
  expert_staff?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
