import type { Request, Response } from 'express';
import IncomeModel from '../models/IncomeModel.js';
import ExpenseModel from '../models/ExpenseModel.js';

export const ReportController = {
  async monthly(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const year = Number(req.query.year) || new Date().getFullYear();

      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const months = Array.from({ length: 12 }, (_, i) => {
        const m = String(i + 1).padStart(2, '0');
        const startDate = `${year}-${m}-01`;
        const lastDay = new Date(year, i + 1, 0).getDate();
        const endDate = `${year}-${m}-${lastDay}`;
        return { month: i + 1, startDate, endDate };
      });

      const monthlyData = await Promise.all(
        months.map(async (m) => {
          const [income, expense] = await Promise.all([
            IncomeModel.getStats(entityId, m.startDate, m.endDate),
            ExpenseModel.getStats(entityId, m.startDate, m.endDate),
          ]);
          return {
            month: m.month,
            income: income.total,
            expenses: expense.total,
            net: income.total - expense.total,
          };
        }),
      );

      const totals = monthlyData.reduce(
        (acc, m) => ({
          total_income: acc.total_income + m.income,
          total_expenses: acc.total_expenses + m.expenses,
          total_net: acc.total_net + m.net,
        }),
        { total_income: 0, total_expenses: 0, total_net: 0 },
      );

      res.status(200).json({
        data: {
          year,
          months: monthlyData,
          totals,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async annual(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const year = Number(req.query.year) || new Date().getFullYear();

      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const [income, expense] = await Promise.all([
        IncomeModel.getStats(entityId, startDate, endDate),
        ExpenseModel.getStats(entityId, startDate, endDate),
      ]);

      res.status(200).json({
        data: {
          year,
          total_income: income.total,
          total_expenses: expense.total,
          net: income.total - expense.total,
          income_by_category: income.byCategory,
          expenses_by_category: expense.byCategory,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async categories(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;

      if (!entityId || !startDate || !endDate) {
        res.status(400).json({ error: { message: 'entity_id, start_date et end_date requis', status: 400 } });
        return;
      }

      const [income, expense] = await Promise.all([
        IncomeModel.getStats(entityId, startDate, endDate),
        ExpenseModel.getStats(entityId, startDate, endDate),
      ]);

      res.status(200).json({
        data: {
          period: { start_date: startDate, end_date: endDate },
          income: {
            total: income.total,
            count: income.count,
            by_category: income.byCategory,
          },
          expenses: {
            total: expense.total,
            count: expense.count,
            by_category: expense.byCategory,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
