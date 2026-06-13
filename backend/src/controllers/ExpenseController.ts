import type { Request, Response } from 'express';
import ExpenseModel from '../models/ExpenseModel.js';
import AccountModel from '../models/AccountModel.js';
import BudgetModel from '../models/BudgetModel.js';

export const ExpenseController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const expenses = await ExpenseModel.findByEntity(entityId, {
        account_id: req.query.account_id ? Number(req.query.account_id) : undefined,
        category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      });

      res.status(200).json({ data: expenses });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, account_id, category_id, amount, description, date, is_recurring, recurring_interval, recurring_end_date } = req.body;

      if (!entity_id || !account_id || !category_id || !amount || !date) {
        res.status(400).json({ error: { message: 'entity_id, account_id, category_id, amount et date requis', status: 400 } });
        return;
      }

      const expense = await ExpenseModel.create({
        entity_id,
        account_id,
        category_id,
        user_id: req.user!.userId,
        amount,
        description: description || null,
        date,
        is_recurring: is_recurring || 0,
        recurring_interval: recurring_interval || null,
        recurring_end_date: recurring_end_date || null,
      });

      const account = await AccountModel.findById(account_id);
      if (account) {
        const newBalance = Number(account.balance) - amount;
        await AccountModel.updateBalance(account_id, newBalance);
      }

      res.status(201).json({ data: expense, message: 'Dépense enregistrée avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const expense = await ExpenseModel.findById(Number(req.params.id));
      if (!expense) {
        res.status(404).json({ error: { message: 'Dépense non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ data: expense });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { account_id, category_id, amount, description, date, is_recurring, recurring_interval, recurring_end_date } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (account_id !== undefined) updateData.account_id = account_id;
      if (category_id !== undefined) updateData.category_id = category_id;
      if (amount !== undefined) updateData.amount = amount;
      if (description !== undefined) updateData.description = description;
      if (date !== undefined) updateData.date = date;
      if (is_recurring !== undefined) updateData.is_recurring = is_recurring;
      if (recurring_interval !== undefined) updateData.recurring_interval = recurring_interval;
      if (recurring_end_date !== undefined) updateData.recurring_end_date = recurring_end_date;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await ExpenseModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Dépense non trouvée', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Dépense mise à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const expense = await ExpenseModel.findById(Number(req.params.id));
      if (!expense) {
        res.status(404).json({ error: { message: 'Dépense non trouvée', status: 404 } });
        return;
      }

      await ExpenseModel.delete(Number(req.params.id));

      const account = await AccountModel.findById(expense.account_id);
      if (account) {
        const newBalance = Number(account.balance) + Number(expense.amount);
        await AccountModel.updateBalance(expense.account_id, newBalance);
      }

      res.status(200).json({ message: 'Dépense supprimée' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async stats(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const startDate = (req.query.start_date as string) || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endDate = (req.query.end_date as string) || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      const [stats, budgets] = await Promise.all([
        ExpenseModel.getStats(entityId, startDate, endDate),
        BudgetModel.findByEntity(entityId),
      ]);

      const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);

      res.status(200).json({
        data: {
          ...stats,
          total_budget: totalBudget,
          remaining: totalBudget - stats.total,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
