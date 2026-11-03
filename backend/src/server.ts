import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import doctorRoutes from './routes/doctorRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import billingRoutes from './routes/billingRoutes';
import reminderRoutes from './routes/reminderRoutes';
import reportRoutes from './routes/reportRoutes';
import tenantRoutes from './routes/tenantRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Router supporting both '/api/*' and direct path rewrites
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'CuraPulse Smart Clinic Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/prescriptions', prescriptionRoutes);
apiRouter.use('/billing', billingRoutes);
apiRouter.use('/reminders', reminderRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/tenant', tenantRoutes);

app.use('/api', apiRouter);
// Also support direct routing in serverless environments
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/assets')) {
    return next();
  }
  // Try apiRouter if requested path matches an API endpoint
  apiRouter(req, res, next);
});

// Serve frontend static build if present
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(frontendDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 CuraPulse Smart Clinic API running at http://localhost:${PORT}`);
  });
}

export default app;
export { app };
