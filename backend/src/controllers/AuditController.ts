import type { Request, Response } from 'express';
import AuditLogModel from '../models/AuditLogModel.js';

export const AuditController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const logs = await AuditLogModel.findByEntity(entityId, limit, offset);
      res.status(200).json({ data: logs });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
