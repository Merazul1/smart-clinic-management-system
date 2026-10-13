import { Router } from 'express';
import {
  createPrescription,
  getPrescriptionById,
  listPrescriptions,
} from '../controllers/prescriptionController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listPrescriptions);
router.post('/', requireRole('DOCTOR', 'CLINIC_ADMIN', 'SUPERADMIN'), createPrescription);
router.get('/:id', getPrescriptionById);

export default router;
