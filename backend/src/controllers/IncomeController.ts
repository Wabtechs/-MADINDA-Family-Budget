import type { Request, Response, NextFunction } from 'express';
import IncomeService from '../services/IncomeService.js';

export const IncomeController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const incomes = await IncomeService.list(entityId, req.user!.userId, {
        account_id: req.query.account_id ? Number(req.query.account_id) : undefined,
        category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      });
      res.status(200).json({ data: incomes });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, account_id, category_id, amount, source, description, date, is_recurring, recurring_interval, recurring_end_date } = req.body;
      if (!entity_id || !account_id || !category_id || !amount || !date) {
        res.status(400).json({ error: { message: 'entity_id, account_id, category_id, amount et date requis', status: 400 } });
        return;
      }
      const income = await IncomeService.create(entity_id, req.user!.userId, {
        account_id, category_id, amount, source, description, date,
        is_recurring: is_recurring || 0,
        recurring_interval: recurring_interval || null,
        recurring_end_date: recurring_end_date || null,
      });
      res.status(201).json({ data: income, message: 'Revenu enregistré avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const income = await IncomeService.getById(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: income });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const income = await IncomeService.update(Number(req.params.id), req.user!.userId, req.body);
      res.status(200).json({ data: income, message: 'Revenu mis à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await IncomeService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Revenu supprimé' });
    } catch (err) {
      next(err);
    }
  },

  async stats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const startDate = (req.query.start_date as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endDate = (req.query.end_date as string) || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
      const stats = await IncomeService.getStats(entityId, req.user!.userId, startDate, endDate);
      res.status(200).json({ data: stats });
    } catch (err) {
      next(err);
    }
  },
};
