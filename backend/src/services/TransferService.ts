import TransferModel from '../models/TransferModel.js';
import AccountModel from '../models/AccountModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import TransactionModel from '../models/TransactionModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class TransferService {
  async list(
    entityId: number,
    userId: number,
    filters?: {
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    await this.requireMembership(entityId, userId);
    return TransferModel.findByEntity(entityId, filters);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      from_account_id: number;
      to_account_id: number;
      amount: number;
      description?: string | null;
      date: string;
    },
  ) {
    if (data.amount <= 0) {
      throw new ValidationError('Le montant du transfert doit être supérieur à 0');
    }

    if (data.from_account_id === data.to_account_id) {
      throw new ValidationError('Les comptes source et destination doivent être différents');
    }

    await this.requireMembership(entityId, userId);

    const fromAccount = await AccountModel.findById(data.from_account_id);
    if (!fromAccount || fromAccount.entity_id !== entityId) {
      throw new NotFoundError('Compte source non trouvé');
    }

    const toAccount = await AccountModel.findById(data.to_account_id);
    if (!toAccount || toAccount.entity_id !== entityId) {
      throw new NotFoundError('Compte de destination non trouvé');
    }

    if (fromAccount.balance < data.amount) {
      throw new ValidationError('Solde insuffisant sur le compte source');
    }

    const transfer = await TransferModel.create({
      ...data,
      entity_id: entityId,
      user_id: userId,
    });

    if (!transfer) {
      throw new Error("Échec de la création du transfert");
    }

    const newFromBalance = fromAccount.balance - data.amount;
    const newToBalance = toAccount.balance + data.amount;

    await AccountModel.updateBalance(data.from_account_id, newFromBalance);
    await AccountModel.updateBalance(data.to_account_id, newToBalance);

    const transactionOut = await TransactionModel.create({
      entity_id: entityId,
      account_id: data.from_account_id,
      user_id: userId,
      type: 'transfer_out',
      reference_type: 'transfer',
      reference_id: transfer.id,
      amount: data.amount,
      description: `Transfert vers ${toAccount.name}${data.description ? `: ${data.description}` : ''}`,
      date: data.date,
    });

    const transactionIn = await TransactionModel.create({
      entity_id: entityId,
      account_id: data.to_account_id,
      user_id: userId,
      type: 'transfer_in',
      reference_type: 'transfer',
      reference_id: transfer.id,
      amount: data.amount,
      description: `Transfert depuis ${fromAccount.name}${data.description ? `: ${data.description}` : ''}`,
      date: data.date,
    });

    await AuditService.log(userId, entityId, 'create', 'transfer', transfer.id, {
      from_account_id: data.from_account_id,
      to_account_id: data.to_account_id,
      amount: data.amount,
    });

    return { transfer, transactions: { out: transactionOut, in: transactionIn } };
  }

  async getById(transferId: number, userId: number) {
    const transfer = await TransferModel.findById(transferId);
    if (!transfer) {
      throw new NotFoundError('Transfert non trouvé');
    }

    await this.requireMembership(transfer.entity_id, userId);
    return transfer;
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

export default new TransferService();
