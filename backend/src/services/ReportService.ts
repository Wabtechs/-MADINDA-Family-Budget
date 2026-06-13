import type { RowDataPacket } from 'mysql2';
import pool from '../config/database.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

interface MonthSumRow extends RowDataPacket {
  month: number;
  total: number;
}

interface YearSumRow extends RowDataPacket {
  year: number;
  total: number;
}

interface CategorySumRow extends RowDataPacket {
  category_name: string;
  total: number;
  count: number;
}

class ReportService {
  async monthlyReport(entityId: number, userId: number, year: number) {
    await this.requireMembership(entityId, userId);

    const [incomeByMonth] = await pool.execute<MonthSumRow[]>(
      `SELECT MONTH(date) AS month, COALESCE(SUM(amount), 0) AS total
       FROM incomes
       WHERE entity_id = ? AND YEAR(date) = ?
       GROUP BY MONTH(date)
       ORDER BY month`,
      [entityId, year],
    );

    const [expenseByMonth] = await pool.execute<MonthSumRow[]>(
      `SELECT MONTH(date) AS month, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE entity_id = ? AND YEAR(date) = ?
       GROUP BY MONTH(date)
       ORDER BY month`,
      [entityId, year],
    );

    const incomeMap = new Map(incomeByMonth.map((r) => [r.month, r.total]));
    const expenseMap = new Map(expenseByMonth.map((r) => [r.month, r.total]));

    const months = [];
    for (let m = 1; m <= 12; m++) {
      const income = incomeMap.get(m) ?? 0;
      const expense = expenseMap.get(m) ?? 0;
      months.push({
        month: m,
        month_name: new Date(year, m - 1).toLocaleString('fr-FR', { month: 'long' }),
        income,
        expense,
        profit: income - expense,
      });
    }

    return { year, months };
  }

  async annualReport(entityId: number, userId: number, year: number) {
    await this.requireMembership(entityId, userId);

    const previousYear = year - 1;

    const [incomeByYear] = await pool.execute<YearSumRow[]>(
      `SELECT YEAR(date) AS year, COALESCE(SUM(amount), 0) AS total
       FROM incomes
       WHERE entity_id = ? AND YEAR(date) IN (?, ?)
       GROUP BY YEAR(date)
       ORDER BY year`,
      [entityId, previousYear, year],
    );

    const [expenseByYear] = await pool.execute<YearSumRow[]>(
      `SELECT YEAR(date) AS year, COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE entity_id = ? AND YEAR(date) IN (?, ?)
       GROUP BY YEAR(date)
       ORDER BY year`,
      [entityId, previousYear, year],
    );

    const currentYearIncome = incomeByYear.find((r) => r.year === year)?.total ?? 0;
    const currentYearExpense = expenseByYear.find((r) => r.year === year)?.total ?? 0;
    const previousYearIncome = incomeByYear.find((r) => r.year === previousYear)?.total ?? 0;
    const previousYearExpense = expenseByYear.find((r) => r.year === previousYear)?.total ?? 0;
    const currentYearProfit = currentYearIncome - currentYearExpense;
    const previousYearProfit = previousYearIncome - previousYearExpense;

    const incomeChange = previousYearIncome > 0
      ? ((currentYearIncome - previousYearIncome) / previousYearIncome) * 100
      : 0;
    const expenseChange = previousYearExpense > 0
      ? ((currentYearExpense - previousYearExpense) / previousYearExpense) * 100
      : 0;

    return {
      year,
      currentYear: {
        income: currentYearIncome,
        expense: currentYearExpense,
        profit: currentYearProfit,
      },
      previousYear: {
        year: previousYear,
        income: previousYearIncome,
        expense: previousYearExpense,
        profit: previousYearProfit,
      },
      comparison: {
        incomeChange: Math.round(incomeChange * 100) / 100,
        expenseChange: Math.round(expenseChange * 100) / 100,
      },
    };
  }

  async categoryAnalysis(
    entityId: number,
    userId: number,
    startDate: string,
    endDate: string,
  ) {
    await this.requireMembership(entityId, userId);

    const [incomeCategories] = await pool.execute<CategorySumRow[]>(
      `SELECT c.name AS category_name, COALESCE(SUM(i.amount), 0) AS total, COUNT(*) AS count
       FROM incomes i
       JOIN categories c ON i.category_id = c.id
       WHERE i.entity_id = ? AND i.date BETWEEN ? AND ?
       GROUP BY c.name
       ORDER BY total DESC`,
      [entityId, startDate, endDate],
    );

    const [expenseCategories] = await pool.execute<CategorySumRow[]>(
      `SELECT c.name AS category_name, COALESCE(SUM(e.amount), 0) AS total, COUNT(*) AS count
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.entity_id = ? AND e.date BETWEEN ? AND ?
       GROUP BY c.name
       ORDER BY total DESC`,
      [entityId, startDate, endDate],
    );

    const totalIncome = incomeCategories.reduce((sum, c) => sum + c.total, 0);
    const totalExpense = expenseCategories.reduce((sum, c) => sum + c.total, 0);

    return {
      period: { startDate, endDate },
      summary: {
        totalIncome,
        totalExpense,
        profit: totalIncome - totalExpense,
      },
      incomeByCategory: incomeCategories.map((c) => ({
        name: c.category_name,
        total: c.total,
        count: c.count,
        percentage: totalIncome > 0 ? Math.round((c.total / totalIncome) * 100 * 100) / 100 : 0,
      })),
      expenseByCategory: expenseCategories.map((c) => ({
        name: c.category_name,
        total: c.total,
        count: c.count,
        percentage: totalExpense > 0 ? Math.round((c.total / totalExpense) * 100 * 100) / 100 : 0,
      })),
    };
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

export default new ReportService();
