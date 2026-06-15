import type { Request, Response, NextFunction } from 'express';
import NotificationService from '../services/NotificationService.js';

export const NotificationController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const unreadOnly = req.query.unread_only === 'true';
      const notifications = await NotificationService.list(req.user!.userId, unreadOnly);
      res.status(200).json({ data: notifications });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await NotificationService.markAsRead(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Notification marquée comme lue' });
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await NotificationService.markAllAsRead(req.user!.userId);
      res.status(200).json({ message: 'Toutes les notifications marquées comme lues' });
    } catch (err) {
      next(err);
    }
  },

  async unreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await NotificationService.getUnreadCount(req.user!.userId);
      res.status(200).json({ data: { count } });
    } catch (err) {
      next(err);
    }
  },
};
