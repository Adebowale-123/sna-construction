import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    return res.json(services);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) return res.status(404).json({ error: 'Not found' });
    return res.json(service);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const service = await prisma.service.create({ data: req.body });
    return res.status(201).json(service);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    return res.json(service);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
