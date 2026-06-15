import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import authRouter from './routes/auth';
import projectsRouter from './routes/projects';
import servicesRouter from './routes/services';
import teamRouter from './routes/team';
import testimonialsRouter from './routes/testimonials';
import messagesRouter from './routes/messages';
import settingsRouter from './routes/settings';
import uploadRouter from './routes/upload';

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/team', teamRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

async function startServer() {
  // Auto-seed database on first run
  try {
    const settingsCount = await prisma.siteSetting.count();
    if (settingsCount === 0) {
      console.log('🌱 Empty database detected — running seed...');
      await import('./seed').then(m => m.default?.().catch(() => {}));
    }
  } catch { /* db not ready yet, migrations will handle */ }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`SNA backend running on port ${PORT}`));
}

startServer();
