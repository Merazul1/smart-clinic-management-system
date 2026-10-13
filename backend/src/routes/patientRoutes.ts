import { Router } from 'express';
import {
  listPatients,
  getPatientById,
  createPatient,
  updatePatient,
  addPatientVitals,
} from '../controllers/patientController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.post('/:id/vitals', addPatientVitals);

export default router;
