import type { Request, Response, NextFunction } from 'express';
import GoalService from '../services/GoalService.js';
import GoalModel from '../models/GoalModel.js';

export const GoalController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const goals = await GoalService.list(entityId, req.user!.userId);
      res.status(200).json({ data: goals });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, name, target_amount, current_amount, deadline, description } = req.body;
      if (!entity_id || !name || !target_amount) {
        res.status(400).json({ error: { message: 'entity_id, name et target_amount requis', status: 400 } });
        return;
      }
      const goal = await GoalService.create(entity_id, req.user!.userId, {
        name,
        target_amount,
        current_amount: current_amount || 0,
        deadline: deadline || null,
        description: description || null,
      });
      res.status(201).json({ data: goal, message: 'Objectif créé avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const goal = await GoalModel.findById(Number(req.params.id));
      if (!goal) {
        res.status(404).json({ error: { message: 'Objectif non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: goal });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await GoalService.update(Number(req.params.id), req.user!.userId, req.body);
      res.status(200).json({ data: updated, message: 'Objectif mis à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await GoalService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Objectif supprimé' });
    } catch (err) {
      next(err);
    }
  },
};
