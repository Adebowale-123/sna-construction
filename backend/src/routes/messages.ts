import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Public — submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required' });
    const msg = await prisma.message.create({ data: { name, email, phone, subject, message } });
    return res.status(201).json({ success: true, id: msg.id });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — get all messages
router.get('/', authenticateToken, async (_req: AuthRequest, res: Response) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(messages);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — mark as read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.message.update({ where: { id: req.params.id }, data: { read: true } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — delete message
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
