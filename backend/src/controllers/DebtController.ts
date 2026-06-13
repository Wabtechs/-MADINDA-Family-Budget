import type { Request, Response } from 'express';
import DebtModel from '../models/DebtModel.js';
import DebtPaymentModel from '../models/DebtPaymentModel.js';

export const DebtController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const debts = await DebtModel.findByEntity(entityId);
      res.status(200).json({ data: debts });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, type, contact_name, amount, description, due_date } = req.body;

      if (!entity_id || !type || !contact_name || !amount) {
        res.status(400).json({ error: { message: 'entity_id, type, contact_name et amount requis', status: 400 } });
        return;
      }

      if (!['owed_to_us', 'we_owe'].includes(type)) {
        res.status(400).json({ error: { message: 'Le type doit être owed_to_us ou we_owe', status: 400 } });
        return;
      }

      const debt = await DebtModel.create({
        entity_id,
        type,
        contact_name,
        amount,
        description: description || null,
        due_date: due_date || null,
      });

      res.status(201).json({ data: debt, message: 'Dette créée avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const debt = await DebtModel.findById(Number(req.params.id));
      if (!debt) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ data: debt });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { type, contact_name, amount, remaining_amount, description, due_date, status } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (type !== undefined) updateData.type = type;
      if (contact_name !== undefined) updateData.contact_name = contact_name;
      if (amount !== undefined) updateData.amount = amount;
      if (remaining_amount !== undefined) updateData.remaining_amount = remaining_amount;
      if (description !== undefined) updateData.description = description;
      if (due_date !== undefined) updateData.due_date = due_date;
      if (status !== undefined) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await DebtModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Dette mise à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await DebtModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Dette supprimée' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async addPayment(req: Request, res: Response): Promise<void> {
    try {
      const debtId = Number(req.params.id);
      const { amount, payment_date, note } = req.body;

      if (!amount || !payment_date) {
        res.status(400).json({ error: { message: 'amount et payment_date requis', status: 400 } });
        return;
      }

      const debt = await DebtModel.findById(debtId);
      if (!debt) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }

      if (Number(amount) > Number(debt.remaining_amount)) {
        res.status(400).json({ error: { message: 'Le paiement dépasse le montant restant', status: 400 } });
        return;
      }

      const payment = await DebtPaymentModel.create({
        debt_id: debtId,
        amount,
        payment_date,
        note: note || null,
      });

      const newRemaining = Number(debt.remaining_amount) - Number(amount);
      const newStatus = newRemaining <= 0 ? 'paid' : 'pending';
      await DebtModel.update(debtId, { remaining_amount: newRemaining, status: newStatus });

      res.status(201).json({ data: payment, message: 'Paiement enregistré' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getPayments(req: Request, res: Response): Promise<void> {
    try {
      const debtId = Number(req.params.id);
      const debt = await DebtModel.findById(debtId);
      if (!debt) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }

      const payments = await DebtPaymentModel.findByDebt(debtId);
      res.status(200).json({ data: payments });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
