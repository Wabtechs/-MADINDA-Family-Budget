import { Router } from 'express';
import { IncomeController } from '../controllers/IncomeController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', IncomeController.stats);
router.get('/', IncomeController.list);
router.post('/', IncomeController.create);
router.get('/:id', IncomeController.getById);
router.put('/:id', IncomeController.update);
router.delete('/:id', IncomeController.delete);

export default router;
