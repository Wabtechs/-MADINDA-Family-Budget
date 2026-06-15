import IncomeModel from '../models/IncomeModel.js';
import AccountModel from '../models/AccountModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import TransactionModel from '../models/TransactionModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class IncomeService {
  async list(
    entityId: number,
    userId: number,
    filters?: {
      account_id?: number;
      category_id?: number;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    await this.requireMembership(entityId, userId);
    return IncomeModel.findByEntity(entityId, filters);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      account_id: number;
      category_id: number;
      amount: number;
      source?: string | null;
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

    const income = await IncomeModel.create({
      ...data,
      entity_id: entityId,
      user_id: userId,
    });

    if (!income) {
      throw new Error("Échec de la création du revenu");
    }

    const newBalance = account.balance + data.amount;
    await AccountModel.updateBalance(data.account_id, newBalance);

    await TransactionModel.create({
      entity_id: entityId,
      account_id: data.account_id,
      user_id: userId,
      type: 'income',
      reference_type: 'income',
      reference_id: income.id,
      amount: data.amount,
      description: data.description ?? data.source ?? 'Revenu',
      date: data.date,
    });

    await AuditService.log(userId, entityId, 'create', 'income', income.id, {
      account_id: data.account_id,
      category_id: data.category_id,
      amount: data.amount,
    });

    return income;
  }

  async getById(incomeId: number, userId: number) {
    const income = await IncomeModel.findById(incomeId);
    if (!income) {
      throw new NotFoundError('Revenu non trouvé');
    }

    await this.requireMembership(income.entity_id, userId);
    return income;
  }

  async update(
    incomeId: number,
    userId: number,
    data: {
      account_id?: number;
      category_id?: number;
      amount?: number;
      source?: string | null;
      description?: string | null;
      date?: string;
      is_recurring?: number;
      recurring_interval?: string | null;
      recurring_end_date?: string | null;
      attachment_url?: string | null;
    },
  ) {
    const income = await IncomeModel.findById(incomeId);
    if (!income) {
      throw new NotFoundError('Revenu non trouvé');
    }

    await this.requireManager(income.entity_id, userId);

    const oldAmount = income.amount;
    const oldAccountId = income.account_id;

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ValidationError('Le montant doit être supérieur à 0');
    }

    if (data.account_id && data.account_id !== oldAccountId) {
      const newAccount = await AccountModel.findById(data.account_id);
      if (!newAccount || newAccount.entity_id !== income.entity_id) {
        throw new NotFoundError('Compte de destination non trouvé');
      }
    }

    const updated = await IncomeModel.update(incomeId, data);
    if (!updated) {
      throw new Error("Échec de la mise à jour du revenu");
    }

    const newAmount = data.amount ?? oldAmount;
    const newAccountId = data.account_id ?? oldAccountId;

    if (newAmount !== oldAmount || newAccountId !== oldAccountId) {
      const oldAccount = await AccountModel.findById(oldAccountId);
      if (oldAccount) {
        const revertedBalance = oldAccount.balance - oldAmount;
        await AccountModel.updateBalance(oldAccountId, revertedBalance);
      }

      const targetAccount = await AccountModel.findById(newAccountId);
      if (targetAccount) {
        const newBalance = targetAccount.balance + newAmount;
        await AccountModel.updateBalance(newAccountId, newBalance);
      }

      const existingTxs = await TransactionModel.findByReference('income', incomeId);
      const transactionData = {
        entity_id: income.entity_id,
        account_id: newAccountId,
        user_id: userId,
        type: 'income' as const,
        reference_type: 'income',
        reference_id: incomeId,
        amount: newAmount,
        description: data.description ?? income.description ?? 'Revenu',
        date: data.date ?? income.date,
      };

      if (existingTxs.length > 0) {
        await TransactionModel.update(existingTxs[0].id, transactionData);
      } else {
        await TransactionModel.create(transactionData);
      }
    }

    await AuditService.log(userId, income.entity_id, 'update', 'income', incomeId, {
      old_amount: oldAmount,
      new_amount: newAmount,
      old_account_id: oldAccountId,
      new_account_id: newAccountId,
    });

    return IncomeModel.findById(incomeId);
  }

  async delete(incomeId: number, userId: number) {
    const income = await IncomeModel.findById(incomeId);
    if (!income) {
      throw new NotFoundError('Revenu non trouvé');
    }

    await this.requireManager(income.entity_id, userId);

    const account = await AccountModel.findById(income.account_id);
    if (account) {
      const newBalance = account.balance - income.amount;
      await AccountModel.updateBalance(income.account_id, newBalance);
    }

    const deleted = await IncomeModel.delete(incomeId);
    if (deleted) {
      await AuditService.log(userId, income.entity_id, 'delete', 'income', incomeId, {
        amount: income.amount,
        account_id: income.account_id,
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
    return IncomeModel.getStats(entityId, startDate, endDate);
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

export default new IncomeService();
