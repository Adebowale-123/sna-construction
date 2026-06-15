import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const folder = (req.query.folder as string) || 'general';
    const dir = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload single image
router.post('/image', authenticateToken, upload.single('image'), (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const folder = (req.query.folder as string) || 'general';
  const url = `/uploads/${folder}/${req.file.filename}`;
  return res.json({ url, filename: req.file.filename });
});

// Upload multiple images
router.post('/images', authenticateToken, upload.array('images', 20), (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || !files.length) return res.status(400).json({ error: 'No files uploaded' });
  const folder = (req.query.folder as string) || 'general';
  const urls = files.map((f) => `/uploads/${folder}/${f.filename}`);
  return res.json({ urls });
});

// Delete image
router.delete('/image', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { path: filePath } = req.body as { path: string };
    const fullPath = path.join(__dirname, '../..', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Could not delete file' });
  }
});

export default router;
