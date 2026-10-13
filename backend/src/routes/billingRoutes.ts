import { Router } from 'express';
import {
  listInvoices,
  createInvoice,
  recordPayment,
  getInvoiceById,
} from '../controllers/billingController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listInvoices);
router.post('/', createInvoice);
router.get('/:id', getInvoiceById);
router.post('/:id/pay', recordPayment);

export default router;
