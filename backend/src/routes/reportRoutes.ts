import { Router } from 'express';
import { getDashboardMetrics, exportCsvReport } from '../controllers/reportController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/metrics', getDashboardMetrics);
router.get('/export', requireRole('CLINIC_ADMIN', 'SUPERADMIN'), exportCsvReport);

export default router;
