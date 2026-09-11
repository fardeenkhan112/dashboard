
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './backend/db.js';
import productRoutes from './backend/routes/productRoutes.js';
import categoryRoutes from './backend/routes/categoryRoutes.js';
import statsRoutes from './backend/routes/statsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const app = express();

const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const frontendDist = path.join(__dirname, 'dist');

fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigin = process.env.CORS_ORIGIN;

app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : undefined
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    database: 'MongoDB',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  if (err?.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image size must be 5MB or less.'
        : err.message || 'Image upload failed.';

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err?.message?.startsWith('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error('API error:', err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

async function startServer() {
  await connectDB();

  if (process.env.NODE_ENV !== 'production') {

const vite = await createViteServer({
  root: __dirname,
  server: {
    middlewareMode: true,
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  appType: 'spa',
});



    app.use(vite.middlewares);
  } else {
    // Production frontend
    app.use(express.static(frontendDist));

    // React Router fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Berry Dashboard running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});

export default app;

