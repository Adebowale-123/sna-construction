import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Public — get all settings as key-value map
router.get('/', async (_, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return res.json(map);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — upsert a setting
router.put('/:key', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const setting = await prisma.siteSetting.upsert({
      where: { key: req.params.key },
      update: { value: req.body.value },
      create: { key: req.params.key, value: req.body.value },
    });
    return res.json(setting);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Admin — bulk upsert settings
router.post('/bulk', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body as Record<string, string>;
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
