import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/unread-count', NotificationController.unreadCount);
router.put('/read-all', NotificationController.markAllAsRead);
router.get('/', NotificationController.list);
router.put('/:id/read', NotificationController.markAsRead);

export default router;
