import BudgetModel from '../models/BudgetModel.js';
import ExpenseModel from '../models/ExpenseModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import NotificationModel from '../models/NotificationModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class BudgetService {
  async list(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);
    return BudgetModel.findByEntity(entityId);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      category_id?: number | null;
      name: string;
      amount: number;
      period?: string;
      start_date: string;
      end_date?: string | null;
    },
  ) {
    if (data.amount <= 0) {
      throw new ValidationError('Le montant du budget doit être supérieur à 0');
    }

    await this.requireManager(entityId, userId);

    const budget = await BudgetModel.create({ ...data, entity_id: entityId });
    if (!budget) {
      throw new Error("Échec de la création du budget");
    }

    await AuditService.log(userId, entityId, 'create', 'budget', budget.id, {
      name: budget.name,
      amount: budget.amount,
      period: budget.period,
    });

    return budget;
  }

  async update(
    budgetId: number,
    userId: number,
    data: {
      name?: string;
      amount?: number;
      period?: string;
      start_date?: string;
      end_date?: string | null;
      category_id?: number | null;
    },
  ) {
    const budget = await BudgetModel.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    await this.requireManager(budget.entity_id, userId);

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ValidationError('Le montant du budget doit être supérieur à 0');
    }

    const updated = await BudgetModel.update(budgetId, data);
    if (!updated) {
      throw new Error("Échec de la mise à jour du budget");
    }

    await AuditService.log(userId, budget.entity_id, 'update', 'budget', budgetId, data);

    return BudgetModel.findById(budgetId);
  }

  async delete(budgetId: number, userId: number) {
    const budget = await BudgetModel.findById(budgetId);
    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    await this.requireManager(budget.entity_id, userId);

    const deleted = await BudgetModel.delete(budgetId);
    if (deleted) {
      await AuditService.log(userId, budget.entity_id, 'delete', 'budget', budgetId, {
        name: budget.name,
      });
    }

    return deleted;
  }

  async checkBudgetStatus(entityId: number) {
    const budgets = await BudgetModel.findByEntity(entityId);
    const notifications: { budget: { id: number; name: string }; ratio: number }[] = [];

    for (const budget of budgets) {
      let spent = 0;

      if (budget.category_id) {
        const result = await ExpenseModel.getStats(
          entityId,
          budget.start_date,
          budget.end_date ?? new Date().toISOString().split('T')[0],
        );

        const categorySpent = result.byCategory.find(
          (c) => c.category_name === budget.category_name,
        );
        spent = categorySpent?.total ?? 0;
      } else {
        const result = await ExpenseModel.getStats(
          entityId,
          budget.start_date,
          budget.end_date ?? new Date().toISOString().split('T')[0],
        );
        spent = result.total;
      }

      await BudgetModel.updateSpent(budget.id, spent);

      if (budget.amount > 0) {
        const ratio = spent / budget.amount;

        if (ratio > 1) {
          const members = await EntityMemberModel.findByEntity(entityId);
          for (const member of members) {
            await NotificationModel.create({
              user_id: member.user_id,
              entity_id: entityId,
              type: 'budget_exceeded',
              title: 'Budget dépassé',
              message: `Le budget "${budget.name}" a été dépassé (${(ratio * 100).toFixed(0)}% utilisé)`,
            });
          }

          notifications.push({ budget: { id: budget.id, name: budget.name }, ratio });
        } else if (ratio >= 0.8) {
          const members = await EntityMemberModel.findByEntity(entityId);
          for (const member of members) {
            await NotificationModel.create({
              user_id: member.user_id,
              entity_id: entityId,
              type: 'budget_warning',
              title: 'Budget presque atteint',
              message: `Le budget "${budget.name}" est à ${(ratio * 100).toFixed(0)}% de sa limite`,
            });
          }

          notifications.push({ budget: { id: budget.id, name: budget.name }, ratio });
        }
      }
    }

    return notifications;
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

  async requireManager(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    if (entity.owner_id === userId) return;

    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);
    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      throw new ForbiddenError('Vous devez être gestionnaire ou administrateur');
    }
  }
}

export default new BudgetService();
