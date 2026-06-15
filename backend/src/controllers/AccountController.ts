import type { Request, Response, NextFunction } from 'express';
import AccountService from '../services/AccountService.js';

export const AccountController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const accounts = await AccountService.list(entityId, req.user!.userId);
      res.status(200).json({ data: accounts });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, name, type, balance, currency, account_number, bank_name, description } = req.body;
      if (!entity_id || !name) {
        res.status(400).json({ error: { message: 'entity_id et name requis', status: 400 } });
        return;
      }
      const account = await AccountService.create(entity_id, req.user!.userId, {
        name,
        type: type || 'bank',
        balance: balance || 0,
        currency: currency || 'EUR',
        account_number: account_number || null,
        bank_name: bank_name || null,
        description: description || null,
      });
      res.status(201).json({ data: account, message: 'Compte créé avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await AccountService.getById(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: account });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateData: Record<string, string | number | null> = {};
      const { name, type, balance, currency, account_number, bank_name, description } = req.body;
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (balance !== undefined) updateData.balance = balance;
      if (currency !== undefined) updateData.currency = currency;
      if (account_number !== undefined) updateData.account_number = account_number;
      if (bank_name !== undefined) updateData.bank_name = bank_name;
      if (description !== undefined) updateData.description = description;
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }
      await AccountService.update(Number(req.params.id), req.user!.userId, updateData);
      res.status(200).json({ message: 'Compte mis à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AccountService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Compte supprimé' });
    } catch (err) {
      next(err);
    }
  },

  async transfer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from_account_id, to_account_id, amount, description, date } = req.body;
      if (!from_account_id || !to_account_id || !amount || !date) {
        res.status(400).json({ error: { message: 'from_account_id, to_account_id, amount et date requis', status: 400 } });
        return;
      }
      const result = await AccountService.transfer(from_account_id, to_account_id, amount, description || null, date, req.user!.userId);
      res.status(200).json({ data: result, message: 'Transfert effectué avec succès' });
    } catch (err) {
      next(err);
    }
  },
};
