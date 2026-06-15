import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(testimonials);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body });
    return res.status(201).json(t);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
    return res.json(t);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
