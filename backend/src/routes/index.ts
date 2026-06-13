import { Router } from 'express';
import authRoutes from './auth.js';
import familyRoutes from './families.js';
import expenseRoutes from './expenses.js';
import categoryRoutes from './categories.js';
import budgetRoutes from './budgets.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/families', familyRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);

export default router;
