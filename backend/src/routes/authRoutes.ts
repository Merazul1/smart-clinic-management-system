import { Router } from 'express';
import { login, registerClinic, getMe, demoLogin } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register-clinic', registerClinic);
router.post('/demo-login', demoLogin);
router.get('/me', authenticate, getMe);

export default router;
