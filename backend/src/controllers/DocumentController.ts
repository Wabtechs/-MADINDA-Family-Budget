import type { Request, Response } from 'express';
import DocumentModel from '../models/DocumentModel.js';

export const DocumentController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const documents = await DocumentModel.findByEntity(entityId);
      res.status(200).json({ data: documents });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { entity_id, name, type, file_url, file_size, mime_type, description } = req.body;

      if (!entity_id || !name || !file_url) {
        res.status(400).json({ error: { message: 'entity_id, name et file_url requis', status: 400 } });
        return;
      }

      const document = await DocumentModel.create({
        entity_id,
        user_id: req.user!.userId,
        name,
        type: type || 'other',
        file_url,
        file_size: file_size || null,
        mime_type: mime_type || null,
        description: description || null,
      });

      res.status(201).json({ data: document, message: 'Document créé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await DocumentModel.delete(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ error: { message: 'Document non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ message: 'Document supprimé' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },
};
