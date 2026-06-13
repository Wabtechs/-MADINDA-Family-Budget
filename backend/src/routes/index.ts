import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import authRoutes from './auth.js';
import entityRoutes from './entities.js';
import accountRoutes from './accounts.js';
import incomeRoutes from './incomes.js';
import expenseRoutes from './expenses.js';
import transferRoutes from './transfers.js';
import budgetRoutes from './budgets.js';
import goalRoutes from './goals.js';
import debtRoutes from './debts.js';
import notificationRoutes from './notifications.js';
import documentRoutes from './documents.js';
import dashboardRoutes from './dashboard.js';
import reportRoutes from './reports.js';
import auditRoutes from './audit.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/entities', entityRoutes);
router.use('/accounts', accountRoutes);
router.use('/incomes', incomeRoutes);
router.use('/expenses', expenseRoutes);
router.use('/transfers', transferRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/debts', debtRoutes);
router.use('/notifications', notificationRoutes);
router.use('/documents', documentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-logs', auditRoutes);

export default router;
