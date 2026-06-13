import type { Request, Response } from 'express';
import TransferModel from '../models/TransferModel.js';
import AccountModel from '../models/AccountModel.js';

export const TransferController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }

      const transfers = await TransferModel.findByEntity(entityId, {
        start_date: req.query.start_date as string,
        end_date: req.query.end_date as string,
      });

      res.status(200).json({ data: transfers });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, from_account_id, to_account_id, amount, description, date } = req.body;

      if (!entity_id || !from_account_id || !to_account_id || !amount || !date) {
        res.status(400).json({ error: { message: 'entity_id, from_account_id, to_account_id, amount et date requis', status: 400 } });
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

      const transfer = await TransferModel.create({
        entity_id,
        from_account_id,
        to_account_id,
        user_id: req.user!.userId,
        amount,
        description: description || null,
        date,
      });

      res.status(201).json({ data: transfer, message: 'Transfert effectué avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const transfer = await TransferModel.findById(Number(req.params.id));
      if (!transfer) {
        res.status(404).json({ error: { message: 'Transfert non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: transfer });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
