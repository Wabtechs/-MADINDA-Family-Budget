import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);
router.get('/', CategoryController.list);

export default router;
