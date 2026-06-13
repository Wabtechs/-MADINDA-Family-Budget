import type { RowDataPacket } from 'mysql2';
import pool from '../config/database.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import TransactionModel from '../models/TransactionModel.js';
import BudgetModel from '../models/BudgetModel.js';
import AccountModel from '../models/AccountModel.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

interface BalanceRow extends RowDataPacket {
  total: number;
}

interface MonthSumRow extends RowDataPacket {
  month: string;
  total: number;
}

interface CategorySumRow extends RowDataPacket {
  category_name: string;
  total: number;
}

class DashboardService {
  async getDashboardData(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [currentBalance] = await pool.execute<BalanceRow[]>(
      'SELECT COALESCE(SUM(balance), 0) AS total FROM accounts WHERE entity_id = ? AND is_active = 1',
      [entityId],
    );

    const [monthlyIncomeRows] = await pool.execute<BalanceRow[]>(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM incomes
       WHERE entity_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
      [entityId, currentMonth],
    );

    const [monthlyExpenseRows] = await pool.execute<BalanceRow[]>(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM expenses
       WHERE entity_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
      [entityId, currentMonth],
    );

    const monthlyIncome = monthlyIncomeRows[0].total;
    const monthlyExpense = monthlyExpenseRows[0].total;
    const monthlyProfit = monthlyIncome - monthlyExpense;

    const recentTransactions = await TransactionModel.getRecent(entityId, 10);

    const [topCategories] = await pool.execute<CategorySumRow[]>(
      `SELECT c.name AS category_name, COALESCE(SUM(e.amount), 0) AS total
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.entity_id = ? AND DATE_FORMAT(e.date, '%Y-%m') = ?
       GROUP BY c.name
       ORDER BY total DESC
       LIMIT 5`,
      [entityId, currentMonth],
    );

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

    const [incomeByMonth] = await pool.execute<MonthSumRow[]>(
      `SELECT DATE_FORMAT(date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS total
       FROM incomes
       WHERE entity_id = ? AND date >= ?
       GROUP BY DATE_FORMAT(date, '%Y-%m')
       ORDER BY month`,
      [entityId, sixMonthsAgoStr],
    );

    const [expenseByMonth] = await pool.execute<MonthSumRow[]>(
      `SELECT DATE_FORMAT(date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE entity_id = ? AND date >= ?
       GROUP BY DATE_FORMAT(date, '%Y-%m')
       ORDER BY month`,
      [entityId, sixMonthsAgoStr],
    );

    const monthlyComparison = this.buildMonthlyComparison(
      sixMonthsAgo,
      incomeByMonth,
      expenseByMonth,
    );

    const budgets = await BudgetModel.findByEntity(entityId);
    const budgetStatus = budgets.map((b) => ({
      id: b.id,
      name: b.name,
      amount: b.amount,
      spent: b.spent,
      ratio: b.amount > 0 ? b.spent / b.amount : 0,
    }));

    const accounts = await AccountModel.findByEntity(entityId);
    const accountSummary = accounts
      .filter((a) => a.is_active === 1)
      .map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        balance: a.balance,
        currency: a.currency,
      }));

    return {
      currentBalance: currentBalance[0].total,
      monthlyIncome,
      monthlyExpense,
      monthlyProfit,
      recentTransactions,
      topCategories,
      monthlyComparison,
      budgetStatus,
      accountSummary,
    };
  }

  private buildMonthlyComparison(
    startDate: Date,
    incomeRows: MonthSumRow[],
    expenseRows: MonthSumRow[],
  ) {
    const months: string[] = [];
    const now = new Date();

    for (let d = new Date(startDate); d <= now; d.setMonth(d.getMonth() + 1)) {
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const incomeMap = new Map(incomeRows.map((r) => [r.month, r.total]));
    const expenseMap = new Map(expenseRows.map((r) => [r.month, r.total]));

    return months.map((month) => ({
      month,
      income: incomeMap.get(month) ?? 0,
      expense: expenseMap.get(month) ?? 0,
    }));
  }

  async requireMembership(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    const isOwner = entity.owner_id === userId;
    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);

    if (!isOwner && !member) {
      throw new ForbiddenError("Vous n'êtes pas membre de cette entité");
    }
  }
}

export default new DashboardService();
