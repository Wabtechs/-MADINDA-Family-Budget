import type { Request, Response, NextFunction } from 'express';
import BudgetService from '../services/BudgetService.js';
import BudgetModel from '../models/BudgetModel.js';

export const BudgetController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const budgets = await BudgetService.list(entityId, req.user!.userId);
      res.status(200).json({ data: budgets });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, category_id, name, amount, period, start_date, end_date } = req.body;
      if (!entity_id || !name || !amount || !start_date) {
        res.status(400).json({ error: { message: 'entity_id, name, amount et start_date requis', status: 400 } });
        return;
      }
      const budget = await BudgetService.create(entity_id, req.user!.userId, {
        category_id: category_id || null,
        name,
        amount,
        period: period || 'monthly',
        start_date,
        end_date: end_date || null,
      });
      res.status(201).json({ data: budget, message: 'Budget créé avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const budget = await BudgetModel.findById(Number(req.params.id));
      if (!budget) {
        res.status(404).json({ error: { message: 'Budget non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: budget });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await BudgetService.update(Number(req.params.id), req.user!.userId, req.body);
      res.status(200).json({ data: updated, message: 'Budget mis à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await BudgetService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Budget supprimé' });
    } catch (err) {
      next(err);
    }
  },
};
