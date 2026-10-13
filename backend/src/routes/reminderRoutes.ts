import { Router } from 'express';
import {
  listReminders,
  triggerManualReminder,
  getDirectWhatsAppLink,
} from '../controllers/reminderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listReminders);
router.post('/send', triggerManualReminder);
router.get('/whatsapp-link/:appointmentId', getDirectWhatsAppLink);

export default router;
