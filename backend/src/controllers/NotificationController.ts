import type { Request, Response } from 'express';
import NotificationModel from '../models/NotificationModel.js';

export const NotificationController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const unreadOnly = req.query.unread_only === 'true';
      const notifications = await NotificationModel.findByUser(req.user!.userId, unreadOnly);
      res.status(200).json({ data: notifications });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const updated = await NotificationModel.markAsRead(Number(req.params.id));
      if (!updated) {
        res.status(404).json({ error: { message: 'Notification non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Notification marquée comme lue' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      await NotificationModel.markAllAsRead(req.user!.userId);
      res.status(200).json({ message: 'Toutes les notifications marquées comme lues' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async unreadCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await NotificationModel.getUnreadCount(req.user!.userId);
      res.status(200).json({ data: { count } });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
