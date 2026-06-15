import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_, res) => {
  try {
    const members = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
    return res.json(members);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const member = await prisma.teamMember.create({ data: req.body });
    return res.status(201).json(member);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const member = await prisma.teamMember.update({ where: { id: req.params.id }, data: req.body });
    return res.json(member);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
