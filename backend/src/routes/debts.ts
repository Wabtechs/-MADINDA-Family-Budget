import { Router } from 'express';
import { DebtController } from '../controllers/DebtController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', DebtController.list);
router.post('/', DebtController.create);
router.get('/:id', DebtController.getById);
router.put('/:id', DebtController.update);
router.delete('/:id', DebtController.delete);
router.post('/:id/payments', DebtController.addPayment);
router.get('/:id/payments', DebtController.getPayments);

export default router;
