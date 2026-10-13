import { Router } from 'express';
import {
  getClinicProfile,
  updateClinicProfile,
  updateSubscription,
  getSuperAdminOverview,
} from '../controllers/tenantController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getClinicProfile);
router.put('/profile', requireRole('CLINIC_ADMIN', 'SUPERADMIN'), updateClinicProfile);
router.post('/subscription', requireRole('CLINIC_ADMIN', 'SUPERADMIN'), updateSubscription);
router.get('/superadmin/overview', requireRole('SUPERADMIN'), getSuperAdminOverview);

export default router;
