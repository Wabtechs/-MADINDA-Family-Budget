import type { Request, Response, NextFunction } from 'express';
import DebtService from '../services/DebtService.js';
import DebtModel from '../models/DebtModel.js';

export const DebtController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const debts = await DebtService.list(entityId, req.user!.userId);
      res.status(200).json({ data: debts });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, type, contact_name, amount, description, due_date } = req.body;
      if (!entity_id || !type || !contact_name || !amount) {
        res.status(400).json({ error: { message: 'entity_id, type, contact_name et amount requis', status: 400 } });
        return;
      }
      const debt = await DebtService.create(entity_id, req.user!.userId, {
        type, contact_name, amount,
        description: description || null,
        due_date: due_date || null,
      });
      res.status(201).json({ data: debt, message: 'Dette créée avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const debt = await DebtModel.findById(Number(req.params.id));
      if (!debt) {
        res.status(404).json({ error: { message: 'Dette non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ data: debt });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await DebtService.update(Number(req.params.id), req.user!.userId, req.body);
      res.status(200).json({ data: updated, message: 'Dette mise à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DebtService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Dette supprimée' });
    } catch (err) {
      next(err);
    }
  },

  async addPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const debtId = Number(req.params.id);
      const { amount, payment_date, note } = req.body;
      if (!amount || !payment_date) {
        res.status(400).json({ error: { message: 'amount et payment_date requis', status: 400 } });
        return;
      }
      const payment = await DebtService.addPayment(debtId, req.user!.userId, { amount, payment_date, note: note || null });
      res.status(201).json({ data: payment, message: 'Paiement enregistré' });
    } catch (err) {
      next(err);
    }
  },

  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payments = await DebtService.getPayments(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: payments });
    } catch (err) {
      next(err);
    }
  },
};
