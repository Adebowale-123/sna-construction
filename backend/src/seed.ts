import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  const password = await bcrypt.hash('sna2024admin', 10);
  await prisma.user.upsert({
    where: { email: 'admin@snaconstruction.com' },
    update: {},
    create: { email: 'admin@snaconstruction.com', password, name: 'SNA Admin', role: 'admin' },
  });

  const settings = [
    { key: 'company_name', value: 'SNA Construction Limited' },
    { key: 'tagline', value: 'Building Excellence, Engineering the Future' },
    { key: 'about_short', value: 'SNA Construction Limited is a leading construction and engineering company based in Lagos, Nigeria, delivering world-class building solutions across West Africa.' },
    { key: 'about_full', value: 'With over 15 years of experience in the construction industry, SNA Construction Limited has established itself as a trusted name in building excellence. From residential homes to large-scale commercial complexes, we bring your vision to life with precision, quality, and integrity. Our team of certified engineers, architects, and construction professionals is committed to delivering projects on time, within budget, and to the highest standards.' },
    { key: 'phone', value: '09060203705' },
    { key: 'email', value: 'sna.constructions@outlook.com' },
    { key: 'address', value: 'Wuraola House, 90 Allen Ave, Allen, Ikeja 101233, Lagos, Nigeria' },
    { key: 'whatsapp', value: '2349060203705' },
    { key: 'years_experience', value: '15' },
    { key: 'projects_completed', value: '250+' },
    { key: 'happy_clients', value: '180+' },
    { key: 'expert_staff', value: '60+' },
    { key: 'facebook', value: 'https://facebook.com/snaconstruction' },
    { key: 'instagram', value: 'https://instagram.com/snaconstruction' },
    { key: 'linkedin', value: 'https://linkedin.com/company/snaconstruction' },
    { key: 'twitter', value: 'https://twitter.com/snaconstruction' },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  const services = [
    { title: 'Building Construction', description: 'From foundation to finish, we construct residential, commercial, and industrial buildings to the highest standards using quality materials and expert craftsmanship.', icon: 'building', features: JSON.stringify(['Residential homes & estates', 'Commercial office buildings', 'Industrial warehouses & factories', 'Multi-storey developments', 'Quality materials & finishing']), order: 1, image: IMG('1504307651254-35680f356dfd') },
    { title: 'Renovation & Remodeling', description: 'Transform your existing space with our expert renovation and remodeling services, breathing new life into homes and commercial properties.', icon: 'hammer', features: JSON.stringify(['Full property renovation', 'Interior remodeling', 'Structural modifications', 'Roofing & waterproofing', 'Facade restoration']), order: 2, image: IMG('1562259949-e8e7290044b2') },
    { title: 'Civil & Structural Engineering', description: 'Our certified structural engineers provide comprehensive design, analysis, and supervision ensuring structural integrity and safety.', icon: 'cog', features: JSON.stringify(['Structural design & analysis', 'Foundation engineering', 'Soil investigation', 'Structural inspection', 'Engineering certification']), order: 3, image: IMG('1581091226825-a6a2a5aee158') },
    { title: 'Project Management', description: 'Professional end-to-end project management ensuring your construction project is delivered on time, within budget, and to specification.', icon: 'clipboard', features: JSON.stringify(['Planning & scheduling', 'Cost estimation & control', 'Quality assurance', 'Site supervision', 'Contractor coordination']), order: 4, image: IMG('1454165804606-c3d57bc86b40') },
    { title: 'Interior Design & Finishing', description: 'Our interior design team creates stunning, functional spaces that reflect your style and exceed your expectations.', icon: 'paint', features: JSON.stringify(['Space planning & design', 'Premium material selection', 'Custom furniture & fittings', 'Lighting design', 'Luxury finishing & décor']), order: 5, image: IMG('1618221195710-dd6b41faaea6') },
    { title: 'Electrical & Mechanical Works', description: 'Complete MEP (Mechanical, Electrical, and Plumbing) services for all types of construction projects.', icon: 'zap', features: JSON.stringify(['Electrical installation', 'Plumbing & drainage', 'HVAC systems', 'Solar panel installation', 'Generator & backup systems']), order: 6, image: IMG('1621905251189-8f71b7c301e8') },
    { title: 'Road & Civil Works', description: 'We deliver roads, drainage systems, and civil infrastructure projects with precision and compliance to national standards.', icon: 'road', features: JSON.stringify(['Road construction & rehabilitation', 'Drainage & stormwater systems', 'Culverts & bridges', 'Earthworks & grading', 'Estate road development']), order: 7, image: IMG('1545987796-200677ee1011') },
    { title: 'Property Development', description: 'We develop premium residential and commercial properties for sale or lease, offering investment opportunities across Lagos and beyond.', icon: 'home', features: JSON.stringify(['Land acquisition & development', 'Estate planning', 'Residential development', 'Commercial real estate', 'Off-plan sales & marketing']), order: 8, image: IMG('1600585154340-be6161a56a0c') },
  ];
  await prisma.service.deleteMany();
  for (const s of services) await prisma.service.create({ data: s });

  const projects = [
    {
      title: 'Victoria Island Commercial Complex',
      description: 'A state-of-the-art 8-storey commercial office building featuring modern amenities, underground parking, and smart building systems.',
      category: 'commercial', location: 'Victoria Island, Lagos', year: 2023,
      client: 'Zenith Properties Ltd', value: '₦2.4 Billion', duration: '18 months',
      status: 'completed', featured: true,
      thumbnail: IMG('1486406146926-c627a92ad1ab', 900),
      images: JSON.stringify([IMG('1486406146926-c627a92ad1ab', 900), IMG('1486325212027-8081e485255e', 900), IMG('1545773440-3719b9d2e9b1', 900)]),
    },
    {
      title: 'Lekki Phase 1 Luxury Estate',
      description: 'A premium residential estate of 24 detached duplex homes with swimming pools, landscaped gardens, and 24/7 security infrastructure.',
      category: 'residential', location: 'Lekki Phase 1, Lagos', year: 2023,
      client: 'Harmony Homes', value: '₦1.8 Billion', duration: '24 months',
      status: 'completed', featured: true,
      thumbnail: IMG('1600596542815-ffad4c1539a9', 900),
      images: JSON.stringify([IMG('1600596542815-ffad4c1539a9', 900), IMG('1600585154340-be6161a56a0c', 900), IMG('1570129477492-45c003edd2be', 900)]),
    },
    {
      title: 'Ikeja Shopping Mall Renovation',
      description: 'Complete renovation and modernization of a 3-storey shopping mall including structural reinforcement, new facades, and updated MEP systems.',
      category: 'commercial', location: 'Ikeja, Lagos', year: 2022,
      client: 'Ikeja Mall Management', value: '₦650 Million', duration: '10 months',
      status: 'completed', featured: true,
      thumbnail: IMG('1562259949-e8e7290044b2', 900),
      images: JSON.stringify([IMG('1562259949-e8e7290044b2', 900), IMG('1555636399-7e4ded74b3da', 900)]),
    },
    {
      title: 'Abuja Federal Government Secretariat',
      description: 'Construction of a modern government office complex with 5 administrative blocks, conference facilities, and parking for 500 vehicles.',
      category: 'government', location: 'Central Business District, Abuja', year: 2022,
      client: 'Federal Ministry of Works', value: '₦4.1 Billion', duration: '30 months',
      status: 'completed', featured: true,
      thumbnail: IMG('1587135991338-0e8c5c7b5f9b', 900),
      images: JSON.stringify([IMG('1587135991338-0e8c5c7b5f9b', 900), IMG('1454165804606-c3d57bc86b40', 900)]),
    },
    {
      title: 'Allen Avenue Road Rehabilitation',
      description: 'Complete rehabilitation of 2.5km stretch of Allen Avenue including road reconstruction, drainage channels, and streetlighting installation.',
      category: 'infrastructure', location: 'Allen Avenue, Ikeja, Lagos', year: 2023,
      client: 'Lagos State Government', value: '₦380 Million', duration: '6 months',
      status: 'completed', featured: false,
      thumbnail: IMG('1545987796-200677ee1011', 900),
      images: JSON.stringify([IMG('1545987796-200677ee1011', 900)]),
    },
    {
      title: 'GRA Ikoyi Residential Tower',
      description: 'A prestigious 12-floor residential tower with 36 luxury apartments, rooftop garden, gym, and concierge services in the heart of Ikoyi.',
      category: 'residential', location: 'GRA Ikoyi, Lagos', year: 2024,
      client: 'Skyline Developers', value: '₦5.2 Billion', duration: '36 months',
      status: 'ongoing', featured: true,
      thumbnail: IMG('1487958449943-2429e8be8625', 900),
      images: JSON.stringify([IMG('1487958449943-2429e8be8625', 900), IMG('1504307651254-35680f356dfd', 900)]),
    },
  ];
  await prisma.project.deleteMany();
  for (const p of projects) await prisma.project.create({ data: p });

  const testimonials = [
    { name: 'Engr. Babatunde Adewale', company: 'Zenith Properties Ltd', role: 'Managing Director', text: 'SNA Construction delivered our commercial complex exceeding every expectation. Their professionalism, attention to detail, and commitment to quality is unmatched in the industry. We have already engaged them for our next project.', rating: 5, featured: true },
    { name: 'Mrs. Chioma Okafor', company: 'Private Client', role: 'Homeowner', text: 'Building my dream home with SNA was a wonderful experience. They communicated throughout the entire process, kept to budget, and the finishing quality is exceptional. I highly recommend them to anyone.', rating: 5, featured: true },
    { name: 'Alhaji Musa Ibrahim', company: 'Harmony Homes', role: 'Chairman', text: 'We have worked with SNA Construction on three major estate developments and they have never disappointed. Their project management is excellent and they deliver on time without compromising on quality.', rating: 5, featured: true },
    { name: 'Dr. Ngozi Eze', company: 'Eze Medical Group', role: 'CEO', text: 'SNA constructed our new hospital facility to the highest standards. The team understood our unique requirements and delivered a functional, modern medical facility. Absolutely outstanding work.', rating: 5, featured: true },
  ];
  await prisma.testimonial.deleteMany();
  for (const t of testimonials) await prisma.testimonial.create({ data: t });

  const team = [
    { name: 'Engr. Samuel Nwachukwu', role: 'CEO & Principal Engineer', bio: 'Over 20 years of experience in construction and civil engineering. A certified COREN engineer and Fellow of NIQS.', image: IMG('1560250097-0b93528c311a', 400), order: 1 },
    { name: 'Arch. Adaeze Obi', role: 'Chief Architect', bio: 'Licensed architect with extensive experience in commercial and residential design. Member of NIA with 15 years in practice.', image: IMG('1573496359142-b8d87734a5a2', 400), order: 2 },
    { name: 'Engr. Tunde Fashola', role: 'Head of Civil Engineering', bio: 'Structural engineering specialist with over 12 years managing complex construction projects across Nigeria.', image: IMG('1472099645785-5658abf4ff4e', 400), order: 3 },
    { name: 'Mr. Emeka Chukwu', role: 'Project Director', bio: 'A seasoned project manager with a track record of delivering large-scale construction projects on time and within budget.', image: IMG('1507003211169-0a1dd7228f2d', 400), order: 4 },
    { name: 'Mrs. Kemi Adesanya', role: 'Head of Interior Design', bio: 'Award-winning interior designer bringing creativity and functionality together in every space she designs.', image: IMG('1580489944761-15a19d654956', 400), order: 5 },
    { name: 'Mr. Yusuf Bello', role: 'Head of MEP Works', bio: 'Expert in mechanical, electrical and plumbing systems with over 10 years of experience in large commercial and industrial projects.', image: IMG('1519085360753-af0119f7cbe7', 400), order: 6 },
  ];
  await prisma.teamMember.deleteMany();
  for (const m of team) await prisma.teamMember.create({ data: m });

  console.log('✅ SNA database re-seeded with images!');
  console.log('📧 admin@snaconstruction.com  🔑 sna2024admin');
}

main().catch(console.error).finally(() => prisma.$disconnect());

export default main;
