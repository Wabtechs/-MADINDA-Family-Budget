import { Router } from 'express';
import { EntityController } from '../controllers/EntityController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', EntityController.list);
router.post('/', EntityController.create);
router.get('/:id', EntityController.getById);
router.put('/:id', EntityController.update);
router.delete('/:id', EntityController.delete);
router.get('/:id/members', EntityController.getMembers);
router.post('/:id/members', EntityController.addMember);
router.put('/:id/members/:userId', EntityController.updateMember);
router.delete('/:id/members/:userId', EntityController.removeMember);

export default router;
