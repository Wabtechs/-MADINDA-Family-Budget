import { Router } from 'express';
import { FamilyController } from '../controllers/FamilyController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', FamilyController.list);
router.post('/', FamilyController.create);
router.get('/:id', FamilyController.getById);
router.get('/:id/members', FamilyController.members);
router.post('/:id/members', FamilyController.addMember);
router.delete('/:id/members/:userId', FamilyController.removeMember);

export default router;
