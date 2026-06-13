import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', DashboardController.getDashboard);

export default router;
