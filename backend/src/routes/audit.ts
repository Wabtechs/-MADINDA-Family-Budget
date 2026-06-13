import { Router } from 'express';
import { AuditController } from '../controllers/AuditController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', AuditController.list);

export default router;
