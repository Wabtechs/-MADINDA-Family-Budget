import DocumentModel from '../models/DocumentModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class DocumentService {
  async list(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);
    return DocumentModel.findByEntity(entityId);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      name: string;
      type?: string;
      file_url: string;
      file_size?: number | null;
      mime_type?: string | null;
      description?: string | null;
    },
  ) {
    await this.requireMembership(entityId, userId);

    const document = await DocumentModel.create({
      ...data,
      entity_id: entityId,
      user_id: userId,
    });

    if (!document) {
      throw new Error("Échec de la création du document");
    }

    return document;
  }

  async delete(documentId: number, userId: number) {
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      throw new NotFoundError('Document non trouvé');
    }

    await this.requireManager(document.entity_id, userId);

    return DocumentModel.delete(documentId);
  }

  async requireMembership(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    const isOwner = entity.owner_id === userId;
    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);

    if (!isOwner && !member) {
      throw new ForbiddenError("Vous n'êtes pas membre de cette entité");
    }
  }

  async requireManager(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    if (entity.owner_id === userId) return;

    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);
    if (!member || (member.role !== 'admin' && member.role !== 'manager')) {
      throw new ForbiddenError('Vous devez être gestionnaire ou administrateur');
    }
  }
}

export default new DocumentService();
