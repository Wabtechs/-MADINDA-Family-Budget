import type { Request, Response } from 'express';
import { ExpenseModel } from '../models/ExpenseModel.js';
import { BudgetModel } from '../models/BudgetModel.js';

export const ExpenseController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { family_id, category_id, montant, description, date } = req.body;

      if (!family_id || !category_id || !montant || !date) {
        res.status(400).json({ error: 'family_id, category_id, montant et date requis' });
        return;
      }

      const expense = await ExpenseModel.create({
        family_id,
        user_id: req.user!.userId,
        category_id,
        montant,
        description: description || null,
        date,
      });

      res.status(201).json(expense);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    const familyId = Number(req.query.family_id) || 0;
    if (!familyId) {
      res.status(400).json({ error: 'family_id requis' });
      return;
    }

    const expenses = await ExpenseModel.findByFamily(familyId, {
      startDate: req.query.start_date as string,
      endDate: req.query.end_date as string,
      categoryId: req.query.category_id ? Number(req.query.category_id) : undefined,
      userId: req.query.user_id ? Number(req.query.user_id) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
    });

    res.json(expenses);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const expense = await ExpenseModel.findById(Number(req.params.id));
    if (!expense) {
      res.status(404).json({ error: 'Dépense non trouvée' });
      return;
    }
    res.json(expense);
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await ExpenseModel.update(Number(req.params.id), req.body);
      if (!updated) {
        res.status(404).json({ error: 'Dépense non trouvée' });
        return;
      }
      res.json({ message: 'Dépense mise à jour' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    const deleted = await ExpenseModel.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Dépense non trouvée' });
      return;
    }
    res.json({ message: 'Dépense supprimée' });
  },

  async stats(req: Request, res: Response): Promise<void> {
    const familyId = Number(req.query.family_id) || 0;
    if (!familyId) {
      res.status(400).json({ error: 'family_id requis' });
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = `${year}-${month}-${new Date(year, now.getMonth() + 1, 0).getDate()}`;

    const [categoryStats, monthlyEvolution, recentExpenses, budgets] = await Promise.all([
      ExpenseModel.getCategoryStats(familyId, startOfMonth, endOfMonth),
      ExpenseModel.getMonthlyStats(familyId, year),
      ExpenseModel.findByFamily(familyId, { limit: 5 }),
      BudgetModel.findByFamily(familyId),
    ]);

    const totalExpenses = categoryStats.reduce((sum, c) => sum + Number(c.total), 0);
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.montant), 0);

    res.json({
      total_budget: totalBudget,
      total_expenses: totalExpenses,
      remaining: totalBudget - totalExpenses,
      expenses_by_category: categoryStats,
      monthly_evolution: monthlyEvolution,
      recent_expenses: recentExpenses,
    });
  },
};
