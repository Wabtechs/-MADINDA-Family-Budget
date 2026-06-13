import { Router } from 'express';
import { ExpenseController } from '../controllers/ExpenseController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', ExpenseController.stats);
router.get('/', ExpenseController.list);
router.post('/', ExpenseController.create);
router.get('/:id', ExpenseController.getById);
router.put('/:id', ExpenseController.update);
router.delete('/:id', ExpenseController.delete);

export default router;
