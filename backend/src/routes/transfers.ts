import { Router } from 'express';
import { TransferController } from '../controllers/TransferController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', TransferController.list);
router.post('/', TransferController.create);
router.get('/:id', TransferController.getById);

export default router;
