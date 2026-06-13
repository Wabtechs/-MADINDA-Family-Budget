import type { Request, Response } from 'express';
import BudgetModel from '../models/BudgetModel.js';

export const BudgetController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const budgets = await BudgetModel.findByEntity(entityId);
      res.status(200).json({ data: budgets });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, category_id, name, amount, period, start_date, end_date } = req.body;

      if (!entity_id || !name || !amount || !start_date) {
        res.status(400).json({ error: { message: 'entity_id, name, amount et start_date requis', status: 400 } });
        return;
      }

      const budget = await BudgetModel.create({
        entity_id,
        category_id: category_id || null,
        name,
        amount,
        period: period || 'monthly',
        start_date,
        end_date: end_date || null,
      });

      res.status(201).json({ data: budget, message: 'Budget créé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const budget = await BudgetModel.findById(Number(req.params.id));
      if (!budget) {
        res.status(404).json({ error: { message: 'Budget non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: budget });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, amount, spent, period, start_date, end_date, category_id } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (name !== undefined) updateData.name = name;
      if (amount !== undefined) updateData.amount = amount;
      if (spent !== undefined) updateData.spent = spent;
      if (period !== undefined) updateData.period = period;
      if (start_date !== undefined) updateData.start_date = start_date;
      if (end_date !== undefined) updateData.end_date = end_date;
      if (category_id !== undefined) updateData.category_id = category_id;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await BudgetModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Budget non trouvé', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Budget mis à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await BudgetModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Budget non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Budget supprimé' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
