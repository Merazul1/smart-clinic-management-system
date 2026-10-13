import { Router } from 'express';
import {
  listAppointments,
  createAppointment,
  updateAppointmentStatus,
  getOpdQueue,
} from '../controllers/appointmentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listAppointments);
router.post('/', createAppointment);
router.get('/queue/today', getOpdQueue);
router.patch('/:id/status', updateAppointmentStatus);

export default router;
