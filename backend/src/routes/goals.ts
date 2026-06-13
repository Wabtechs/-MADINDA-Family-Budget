import { Router } from 'express';
import { GoalController } from '../controllers/GoalController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', GoalController.list);
router.post('/', GoalController.create);
router.get('/:id', GoalController.getById);
router.put('/:id', GoalController.update);
router.delete('/:id', GoalController.delete);

export default router;
