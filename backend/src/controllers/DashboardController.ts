import type { Request, Response, NextFunction } from 'express';
import DashboardService from '../services/DashboardService.js';

export const DashboardController = {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const data = await DashboardService.getDashboardData(entityId, req.user!.userId);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
};
