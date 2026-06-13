import type { Request, Response } from 'express';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';

export const EntityController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entities = await EntityModel.findAll(req.user!.userId);
      res.status(200).json({ data: entities });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, description, currency, timezone } = req.body;

      if (!name) {
        res.status(400).json({ error: { message: 'Le nom est requis', status: 400 } });
        return;
      }

      const entity = await EntityModel.create({
        name,
        type: type || 'family',
        description: description || null,
        currency: currency || 'EUR',
        timezone: timezone || 'UTC',
        owner_id: req.user!.userId,
      });

      res.status(201).json({ data: entity, message: 'Entité créée avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const entity = await EntityModel.findById(Number(req.params.id));
      if (!entity) {
        res.status(404).json({ error: { message: 'Entité non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ data: entity });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, description, logo, currency, timezone } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (description !== undefined) updateData.description = description;
      if (logo !== undefined) updateData.logo = logo;
      if (currency !== undefined) updateData.currency = currency;
      if (timezone !== undefined) updateData.timezone = timezone;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await EntityModel.update(Number(req.params.id), updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Entité non trouvée', status: 404 } });
        return;
      }

      res.status(200).json({ message: 'Entité mise à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await EntityModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Entité non trouvée', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Entité supprimée' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const members = await EntityMemberModel.findByEntity(Number(req.params.id));
      res.status(200).json({ data: members });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, role } = req.body;
      if (!user_id) {
        res.status(400).json({ error: { message: 'user_id requis', status: 400 } });
        return;
      }

      const member = await EntityMemberModel.create({
        entity_id: Number(req.params.id),
        user_id,
        role: role || 'viewer',
      });

      res.status(201).json({ data: member, message: 'Membre ajouté' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async updateMember(req: Request, res: Response): Promise<void> {
    try {
      const { role, status } = req.body;
      const entityId = Number(req.params.id);
      const userId = Number(req.params.userId);

      const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);
      if (!member) {
        res.status(404).json({ error: { message: 'Membre non trouvé', status: 404 } });
        return;
      }

      const updateData: Record<string, string> = {};
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      await EntityMemberModel.update(member.id, updateData);
      res.status(200).json({ message: 'Membre mis à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.params.id);
      const userId = Number(req.params.userId);

      const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);
      if (!member) {
        res.status(404).json({ error: { message: 'Membre non trouvé', status: 404 } });
        return;
      }

      await EntityMemberModel.delete(member.id);
      res.status(200).json({ message: 'Membre retiré' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },
};
