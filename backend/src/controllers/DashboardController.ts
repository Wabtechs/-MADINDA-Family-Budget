import type { Request, Response } from 'express';
import IncomeModel from '../models/IncomeModel.js';
import ExpenseModel from '../models/ExpenseModel.js';
import BudgetModel from '../models/BudgetModel.js';
import AccountModel from '../models/AccountModel.js';
import TransactionModel from '../models/TransactionModel.js';

export const DashboardController = {
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const startOfMonth = `${year}-${month}-01`;
      const endOfMonth = `${year}-${month}-${new Date(year, now.getMonth() + 1, 0).getDate()}`;
      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;

      const [incomeStats, expenseStats, budgets, accounts, recentTransactions] = await Promise.all([
        IncomeModel.getStats(entityId, startOfMonth, endOfMonth),
        ExpenseModel.getStats(entityId, startOfMonth, endOfMonth),
        BudgetModel.findByEntity(entityId),
        AccountModel.findByEntity(entityId),
        TransactionModel.getRecent(entityId, 10),
      ]);

      const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
      const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

      res.status(200).json({
        data: {
          summary: {
            total_income: incomeStats.total,
            total_expenses: expenseStats.total,
            total_budget: totalBudget,
            remaining_budget: totalBudget - expenseStats.total,
            total_balance: totalBalance,
            income_count: incomeStats.count,
            expense_count: expenseStats.count,
          },
          income_by_category: incomeStats.byCategory,
          expenses_by_category: expenseStats.byCategory,
          budgets,
          accounts,
          recent_transactions: recentTransactions,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
