import type { Request, Response, NextFunction } from 'express';
import AuditService from '../services/AuditService.js';

export const AuditController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const logs = await AuditService.list(entityId, req.user!.userId, limit, offset);
      res.status(200).json({ data: logs });
    } catch (err) {
      next(err);
    }
  },
};
