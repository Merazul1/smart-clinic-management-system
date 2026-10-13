import { Router } from 'express';
import {
  listDoctors,
  createDoctor,
  updateDoctorProfile,
} from '../controllers/doctorController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listDoctors);
router.post('/', requireRole('CLINIC_ADMIN', 'SUPERADMIN'), createDoctor);
router.put('/:id', requireRole('CLINIC_ADMIN', 'DOCTOR', 'SUPERADMIN'), updateDoctorProfile);

export default router;
