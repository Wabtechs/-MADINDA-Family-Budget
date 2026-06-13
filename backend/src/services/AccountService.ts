import AccountModel from '../models/AccountModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import TransactionModel from '../models/TransactionModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class AccountService {
  async list(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);
    return AccountModel.findByEntity(entityId);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      name: string;
      type?: string;
      balance?: number;
      currency?: string;
      account_number?: string | null;
      bank_name?: string | null;
      description?: string | null;
    },
  ) {
    await this.requireMembership(entityId, userId);

    const account = await AccountModel.create({ ...data, entity_id: entityId });
    if (!account) {
      throw new Error("Échec de la création du compte");
    }

    await AuditService.log(userId, entityId, 'create', 'account', account.id, {
      name: account.name,
      type: account.type,
      balance: account.balance,
    });

    return account;
  }

  async getById(accountId: number, userId: number) {
    const account = await AccountModel.findById(accountId);
    if (!account) {
      throw new NotFoundError('Compte non trouvé');
    }

    await this.requireMembership(account.entity_id, userId);
    return account;
  }

  async update(
    accountId: number,
    userId: number,
    data: {
      name?: string;
      type?: string;
      currency?: string;
      account_number?: string | null;
      bank_name?: string | null;
      description?: string | null;
      is_active?: number;
    },
  ) {
    const account = await AccountModel.findById(accountId);
    if (!account) {
      throw new NotFoundError('Compte non trouvé');
    }

    await this.requireAdmin(account.entity_id, userId);

    const updated = await AccountModel.update(accountId, data);
    if (updated) {
      await AuditService.log(userId, account.entity_id, 'update', 'account', accountId, data);
    }

    return updated;
  }

  async delete(accountId: number, userId: number) {
    const account = await AccountModel.findById(accountId);
    if (!account) {
      throw new NotFoundError('Compte non trouvé');
    }

    await this.requireAdmin(account.entity_id, userId);

    const deleted = await AccountModel.delete(accountId);
    if (deleted) {
      await AuditService.log(userId, account.entity_id, 'delete', 'account', accountId, {
        name: account.name,
      });
    }

    return deleted;
  }

  async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string | null,
    date: string,
    userId: number,
  ) {
    if (amount <= 0) {
      throw new ValidationError('Le montant du transfert doit être supérieur à 0');
    }

    const fromAccount = await AccountModel.findById(fromAccountId);
    if (!fromAccount) {
      throw new NotFoundError('Compte source non trouvé');
    }

    const toAccount = await AccountModel.findById(toAccountId);
    if (!toAccount) {
      throw new NotFoundError('Compte de destination non trouvé');
    }

    if (fromAccount.entity_id !== toAccount.entity_id) {
      throw new ValidationError('Les comptes doivent appartenir à la même entité');
    }

    await this.requireMembership(fromAccount.entity_id, userId);

    if (fromAccount.balance < amount) {
      throw new ValidationError('Solde insuffisant sur le compte source');
    }

    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    await AccountModel.updateBalance(fromAccountId, newFromBalance);
    await AccountModel.updateBalance(toAccountId, newToBalance);

    const transferData = {
      entity_id: fromAccount.entity_id,
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      user_id: userId,
      amount,
      description,
      date,
    };

    const transfer = await (await import('../models/TransferModel.js')).default.create(transferData);

    const transactionOut = await TransactionModel.create({
      entity_id: fromAccount.entity_id,
      account_id: fromAccountId,
      user_id: userId,
      type: 'transfer_out',
      reference_type: 'transfer',
      reference_id: transfer!.id,
      amount,
      description: `Transfert vers ${toAccount.name}${description ? `: ${description}` : ''}`,
      date,
    });

    const transactionIn = await TransactionModel.create({
      entity_id: fromAccount.entity_id,
      account_id: toAccountId,
      user_id: userId,
      type: 'transfer_in',
      reference_type: 'transfer',
      reference_id: transfer!.id,
      amount,
      description: `Transfert depuis ${fromAccount.name}${description ? `: ${description}` : ''}`,
      date,
    });

    await AuditService.log(userId, fromAccount.entity_id, 'create', 'transfer', transfer!.id, {
      from_account_id: fromAccountId,
      to_account_id: toAccountId,
      amount,
      description,
    });

    return { transfer, transactions: { out: transactionOut, in: transactionIn } };
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

  async requireAdmin(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    if (entity.owner_id === userId) return;

    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);
    if (!member || member.role !== 'admin') {
      throw new ForbiddenError("Vous devez être administrateur pour effectuer cette action");
    }
  }
}

export default new AccountService();
