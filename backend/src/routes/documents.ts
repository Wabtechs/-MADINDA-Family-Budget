import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', DocumentController.list);
router.post('/', DocumentController.create);
router.delete('/:id', DocumentController.delete);

export default router;
