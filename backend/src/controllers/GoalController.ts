import type { Request, Response } from 'express';
import GoalModel from '../models/GoalModel.js';

export const GoalController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const goals = await GoalModel.findByEntity(entityId);
      res.status(200).json({ data: goals });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, name, target_amount, current_amount, deadline, description } = req.body;

      if (!entity_id || !name || !target_amount) {
        res.status(400).json({ error: { message: 'entity_id, name et target_amount requis', status: 400 } });
        return;
      }

      const goal = await GoalModel.create({
        entity_id,
        name,
        target_amount,
        current_amount: current_amount || 0,
        deadline: deadline || null,
        description: description || null,
      });

      res.status(201).json({ data: goal, message: 'Objectif créé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const goal = await GoalModel.findById(Number(req.params.id));
      if (!goal) {
        res.status(404).json({ error: { message: 'Objectif non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: goal });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, target_amount, current_amount, deadline, status, description } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (name !== undefined) updateData.name = name;
      if (target_amount !== undefined) updateData.target_amount = target_amount;
      if (current_amount !== undefined) updateData.current_amount = current_amount;
      if (deadline !== undefined) updateData.deadline = deadline;
      if (status !== undefined) updateData.status = status;
      if (description !== undefined) updateData.description = description;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await GoalModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Objectif non trouvé', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Objectif mis à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await GoalModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Objectif non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Objectif supprimé' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
