import type { Request, Response } from 'express';
import AccountModel from '../models/AccountModel.js';

export const AccountController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const accounts = await AccountModel.findByEntity(entityId);
      res.status(200).json({ data: accounts });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, name, type, balance, currency, account_number, bank_name, description } = req.body;

      if (!entity_id || !name) {
        res.status(400).json({ error: { message: 'entity_id et name requis', status: 400 } });
        return;
      }

      const account = await AccountModel.create({
        entity_id,
        name,
        type: type || 'bank',
        balance: balance || 0,
        currency: currency || 'EUR',
        account_number: account_number || null,
        bank_name: bank_name || null,
        description: description || null,
      });

      res.status(201).json({ data: account, message: 'Compte créé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const account = await AccountModel.findById(Number(req.params.id));
      if (!account) {
        res.status(404).json({ error: { message: 'Compte non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: account });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, balance, currency, account_number, bank_name, description } = req.body;
      const updateData: Record<string, string | number | null> = {};
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

      const updated = await AccountModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Compte non trouvé', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Compte mis à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await AccountModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Compte non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Compte supprimé' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async transfer(req: Request, res: Response): Promise<void> {
    try {
      const { from_account_id, to_account_id, amount, description, date } = req.body;

      if (!from_account_id || !to_account_id || !amount || !date) {
        res.status(400).json({ error: { message: 'from_account_id, to_account_id, amount et date requis', status: 400 } });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ error: { message: 'Le montant doit être supérieur à 0', status: 400 } });
        return;
      }

      const fromAccount = await AccountModel.findById(from_account_id);
      if (!fromAccount) {
        res.status(404).json({ error: { message: 'Compte source non trouvé', status: 404 } });
        return;
      }

      const toAccount = await AccountModel.findById(to_account_id);
      if (!toAccount) {
        res.status(404).json({ error: { message: 'Compte destination non trouvé', status: 404 } });
        return;
      }

      if (Number(fromAccount.balance) < amount) {
        res.status(400).json({ error: { message: 'Solde insuffisant', status: 400 } });
        return;
      }

      const fromNewBalance = Number(fromAccount.balance) - amount;
      const toNewBalance = Number(toAccount.balance) + amount;

      await AccountModel.updateBalance(from_account_id, fromNewBalance);
      await AccountModel.updateBalance(to_account_id, toNewBalance);

      res.status(200).json({ message: 'Transfert effectué avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },
};
