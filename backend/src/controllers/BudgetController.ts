import type { Request, Response } from 'express';
import { BudgetModel } from '../models/BudgetModel.js';

export const BudgetController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { family_id, category_id, montant, periode, date_debut, date_fin } = req.body;

      if (!family_id || !montant) {
        res.status(400).json({ error: 'family_id et montant requis' });
        return;
      }

      const budget = await BudgetModel.create({
        family_id,
        category_id: category_id || null,
        montant,
        periode: periode || 'monthly',
        date_debut: date_debut || null,
        date_fin: date_fin || null,
      });

      res.status(201).json(budget);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    const familyId = Number(req.query.family_id) || 0;
    if (!familyId) {
      res.status(400).json({ error: 'family_id requis' });
      return;
    }
    const budgets = await BudgetModel.findByFamily(familyId);
    res.json(budgets);
  },

  async update(req: Request, res: Response): Promise<void> {
    const updated = await BudgetModel.update(Number(req.params.id), req.body);
    if (!updated) {
      res.status(404).json({ error: 'Budget non trouvé' });
      return;
    }
    res.json({ message: 'Budget mis à jour' });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const deleted = await BudgetModel.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: 'Budget non trouvé' });
      return;
    }
    res.json({ message: 'Budget supprimé' });
  },
};
