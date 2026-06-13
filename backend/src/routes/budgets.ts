import { Router } from 'express';
import { BudgetController } from '../controllers/BudgetController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', BudgetController.list);
router.post('/', BudgetController.create);
router.get('/:id', BudgetController.getById);
router.put('/:id', BudgetController.update);
router.delete('/:id', BudgetController.delete);

export default router;
