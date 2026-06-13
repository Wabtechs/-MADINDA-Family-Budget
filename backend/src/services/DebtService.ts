import DebtModel from '../models/DebtModel.js';
import DebtPaymentModel from '../models/DebtPaymentModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class DebtService {
  async list(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);
    return DebtModel.findByEntity(entityId);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      type: 'owed_to_us' | 'we_owe';
      contact_name: string;
      amount: number;
      remaining_amount?: number;
      description?: string | null;
      due_date?: string | null;
      status?: string;
    },
  ) {
    if (data.amount <= 0) {
      throw new ValidationError('Le montant doit être supérieur à 0');
    }

    await this.requireManager(entityId, userId);

    const debt = await DebtModel.create({ ...data, entity_id: entityId });
    if (!debt) {
      throw new Error("Échec de la création de la dette");
    }

    await AuditService.log(userId, entityId, 'create', 'debt', debt.id, {
      type: debt.type,
      contact_name: debt.contact_name,
      amount: debt.amount,
    });

    return debt;
  }

  async update(
    debtId: number,
    userId: number,
    data: {
      type?: string;
      contact_name?: string;
      amount?: number;
      remaining_amount?: number;
      description?: string | null;
      due_date?: string | null;
      status?: string;
    },
  ) {
    const debt = await DebtModel.findById(debtId);
    if (!debt) {
      throw new NotFoundError('Dette non trouvée');
    }

    await this.requireManager(debt.entity_id, userId);

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ValidationError('Le montant doit être supérieur à 0');
    }

    const updated = await DebtModel.update(debtId, data);
    if (!updated) {
      throw new Error("Échec de la mise à jour de la dette");
    }

    await AuditService.log(userId, debt.entity_id, 'update', 'debt', debtId, data);

    return DebtModel.findById(debtId);
  }

  async delete(debtId: number, userId: number) {
    const debt = await DebtModel.findById(debtId);
    if (!debt) {
      throw new NotFoundError('Dette non trouvée');
    }

    await this.requireManager(debt.entity_id, userId);

    const deleted = await DebtModel.delete(debtId);
    if (deleted) {
      await AuditService.log(userId, debt.entity_id, 'delete', 'debt', debtId, {
        contact_name: debt.contact_name,
        amount: debt.amount,
      });
    }

    return deleted;
  }

  async addPayment(
    debtId: number,
    userId: number,
    data: {
      amount: number;
      payment_date: string;
      note?: string | null;
    },
  ) {
    if (data.amount <= 0) {
      throw new ValidationError('Le montant du paiement doit être supérieur à 0');
    }

    const debt = await DebtModel.findById(debtId);
    if (!debt) {
      throw new NotFoundError('Dette non trouvée');
    }

    await this.requireManager(debt.entity_id, userId);

    if (data.amount > debt.remaining_amount) {
      throw new ValidationError('Le paiement dépasse le montant restant dû');
    }

    const payment = await DebtPaymentModel.create({
      debt_id: debtId,
      amount: data.amount,
      payment_date: data.payment_date,
      note: data.note,
    });

    if (!payment) {
      throw new Error("Échec de l'enregistrement du paiement");
    }

    const newRemaining = debt.remaining_amount - data.amount;
    const newStatus = newRemaining <= 0 ? 'paid' : 'partial';

    await DebtModel.update(debtId, {
      remaining_amount: newRemaining,
      status: newStatus,
    });

    await AuditService.log(userId, debt.entity_id, 'add_payment', 'debt_payment', payment.id, {
      debt_id: debtId,
      amount: data.amount,
      new_remaining: newRemaining,
    });

    return payment;
  }

  async getPayments(debtId: number, userId: number) {
    const debt = await DebtModel.findById(debtId);
    if (!debt) {
      throw new NotFoundError('Dette non trouvée');
    }

    await this.requireMembership(debt.entity_id, userId);

    return DebtPaymentModel.findByDebt(debtId);
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

export default new DebtService();
