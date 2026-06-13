import NotificationModel from '../models/NotificationModel.js';
import { NotFoundError } from '../utils/errors.js';

class NotificationService {
  async list(userId: number, unreadOnly: boolean = false) {
    return NotificationModel.findByUser(userId, unreadOnly);
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification non trouvée');
    }

    if (notification.user_id !== userId) {
      throw new NotFoundError('Notification non trouvée');
    }

    return NotificationModel.markAsRead(notificationId);
  }

  async markAllAsRead(userId: number) {
    return NotificationModel.markAllAsRead(userId);
  }

  async getUnreadCount(userId: number) {
    return NotificationModel.getUnreadCount(userId);
  }

  async create(
    userId: number,
    entityId: number | null,
    type: string,
    title: string,
    message: string,
  ) {
    return NotificationModel.create({ user_id: userId, entity_id: entityId, type, title, message });
  }
}

export default new NotificationService();
