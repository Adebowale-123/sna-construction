import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Public — get all projects
router.get('/', async (req, res) => {
  try {
    const { category, status, featured } = req.query as Record<string, string>;
    const where: Record<string, unknown> = {};
    if (category && category !== 'all') where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    return res.json(projects);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Public — get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Not found' });
    return res.json(project);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — create project
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    return res.status(201).json(project);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — update project
router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
    return res.json(project);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — delete project
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
