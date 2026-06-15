import type { Request, Response, NextFunction } from 'express';
import TransferService from '../services/TransferService.js';

export const TransferController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const transfers = await TransferService.list(entityId, req.user!.userId, {
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
      });
      res.status(200).json({ data: transfers });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, from_account_id, to_account_id, amount, description, date } = req.body;
      if (!entity_id || !from_account_id || !to_account_id || !amount || !date) {
        res.status(400).json({ error: { message: 'entity_id, from_account_id, to_account_id, amount et date requis', status: 400 } });
        return;
      }
      const result = await TransferService.create(entity_id, req.user!.userId, {
        from_account_id, to_account_id, amount,
        description: description || null, date,
      });
      res.status(201).json({ data: result.transfer, message: 'Transfert effectué avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfer = await TransferService.getById(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: transfer });
    } catch (err) {
      next(err);
    }
  },
};
