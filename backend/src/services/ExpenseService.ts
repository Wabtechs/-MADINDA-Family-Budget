import ExpenseModel from '../models/ExpenseModel.js';
import AccountModel from '../models/AccountModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import TransactionModel from '../models/TransactionModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class ExpenseService {
  async list(
    entityId: number,
    userId: number,
    filters?: {
      account_id?: number;
      category_id?: number;
      user_id?: number;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    await this.requireMembership(entityId, userId);
    return ExpenseModel.findByEntity(entityId, filters);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      account_id: number;
      category_id: number;
      amount: number;
      description?: string | null;
      date: string;
      is_recurring?: number;
      recurring_interval?: string | null;
      recurring_end_date?: string | null;
      attachment_url?: string | null;
    },
  ) {
    if (data.amount <= 0) {
      throw new ValidationError('Le montant doit être supérieur à 0');
    }

    await this.requireMembership(entityId, userId);

    const account = await AccountModel.findById(data.account_id);
    if (!account || account.entity_id !== entityId) {
      throw new NotFoundError('Compte non trouvé');
    }

    const expense = await ExpenseModel.create({
      ...data,
      entity_id: entityId,
      user_id: userId,
    });

    if (!expense) {
      throw new Error("Échec de la création de la dépense");
    }

    const newBalance = account.balance - data.amount;
    await AccountModel.updateBalance(data.account_id, newBalance);

    await TransactionModel.create({
      entity_id: entityId,
      account_id: data.account_id,
      user_id: userId,
      type: 'expense',
      reference_type: 'expense',
      reference_id: expense.id,
      amount: data.amount,
      description: data.description ?? 'Dépense',
      date: data.date,
    });

    await AuditService.log(userId, entityId, 'create', 'expense', expense.id, {
      account_id: data.account_id,
      category_id: data.category_id,
      amount: data.amount,
    });

    return expense;
  }

  async getById(expenseId: number, userId: number) {
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      throw new NotFoundError('Dépense non trouvée');
    }

    await this.requireMembership(expense.entity_id, userId);
    return expense;
  }

  async update(
    expenseId: number,
    userId: number,
    data: {
      account_id?: number;
      category_id?: number;
      amount?: number;
      description?: string | null;
      date?: string;
      is_recurring?: number;
      recurring_interval?: string | null;
      recurring_end_date?: string | null;
      attachment_url?: string | null;
    },
  ) {
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      throw new NotFoundError('Dépense non trouvée');
    }

    await this.requireManager(expense.entity_id, userId);

    const oldAmount = expense.amount;
    const oldAccountId = expense.account_id;

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ValidationError('Le montant doit être supérieur à 0');
    }

    if (data.account_id && data.account_id !== oldAccountId) {
      const newAccount = await AccountModel.findById(data.account_id);
      if (!newAccount || newAccount.entity_id !== expense.entity_id) {
        throw new NotFoundError('Compte de destination non trouvé');
      }
    }

    const updated = await ExpenseModel.update(expenseId, data);
    if (!updated) {
      throw new Error("Échec de la mise à jour de la dépense");
    }

    const newAmount = data.amount ?? oldAmount;
    const newAccountId = data.account_id ?? oldAccountId;

    if (newAmount !== oldAmount || newAccountId !== oldAccountId) {
      const oldAccount = await AccountModel.findById(oldAccountId);
      if (oldAccount) {
        const revertedBalance = oldAccount.balance + oldAmount;
        await AccountModel.updateBalance(oldAccountId, revertedBalance);
      }

      const targetAccount = await AccountModel.findById(newAccountId);
      if (targetAccount) {
        const newBalance = targetAccount.balance - newAmount;
        await AccountModel.updateBalance(newAccountId, newBalance);
      }

      await TransactionModel.create({
        entity_id: expense.entity_id,
        account_id: newAccountId,
        user_id: userId,
        type: 'expense',
        reference_type: 'expense',
        reference_id: expenseId,
        amount: newAmount,
        description: data.description ?? expense.description ?? 'Dépense',
        date: data.date ?? expense.date,
      });
    }

    await AuditService.log(userId, expense.entity_id, 'update', 'expense', expenseId, {
      old_amount: oldAmount,
      new_amount: newAmount,
      old_account_id: oldAccountId,
      new_account_id: newAccountId,
    });

    return ExpenseModel.findById(expenseId);
  }

  async delete(expenseId: number, userId: number) {
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      throw new NotFoundError('Dépense non trouvée');
    }

    await this.requireManager(expense.entity_id, userId);

    const account = await AccountModel.findById(expense.account_id);
    if (account) {
      const newBalance = account.balance + expense.amount;
      await AccountModel.updateBalance(expense.account_id, newBalance);
    }

    const deleted = await ExpenseModel.delete(expenseId);
    if (deleted) {
      await AuditService.log(userId, expense.entity_id, 'delete', 'expense', expenseId, {
        amount: expense.amount,
        account_id: expense.account_id,
      });
    }

    return deleted;
  }

  async getStats(
    entityId: number,
    userId: number,
    startDate: string,
    endDate: string,
  ) {
    await this.requireMembership(entityId, userId);
    return ExpenseModel.getStats(entityId, startDate, endDate);
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

export default new ExpenseService();
