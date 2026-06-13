import { Router } from 'express';
import { ReportController } from '../controllers/ReportController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/monthly', ReportController.monthly);
router.get('/annual', ReportController.annual);
router.get('/categories', ReportController.categories);

export default router;
