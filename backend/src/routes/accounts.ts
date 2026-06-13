import { Router } from 'express';
import { AccountController } from '../controllers/AccountController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/transfer', AccountController.transfer);
router.get('/', AccountController.list);
router.post('/', AccountController.create);
router.get('/:id', AccountController.getById);
router.put('/:id', AccountController.update);
router.delete('/:id', AccountController.delete);

export default router;
