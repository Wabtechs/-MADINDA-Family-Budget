import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import UserModel from '../models/UserModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class EntityService {
  async list(userId: number) {
    const owned = await EntityModel.findAll(userId);
    const memberOf = await EntityMemberModel.findByUser(userId);
    return { owned, memberOf };
  }

  async create(
    userId: number,
    data: {
      name: string;
      type?: string;
      description?: string | null;
      currency?: string;
      timezone?: string;
    },
  ) {
    const entity = await EntityModel.create({ ...data, owner_id: userId });
    if (!entity) {
      throw new Error("Échec de la création de l'entité");
    }

    await EntityMemberModel.create({
      entity_id: entity.id,
      user_id: userId,
      role: 'admin',
      status: 'accepted',
    });

    await AuditService.log(userId, entity.id, 'create', 'entity', entity.id, {
      name: entity.name,
      type: entity.type,
    });

    return entity;
  }

  async getById(entityId: number, userId: number) {
    const entity = await EntityModel.findById(entityId);
    if (!entity) {
      throw new NotFoundError('Entité non trouvée');
    }

    const isOwner = entity.owner_id === userId;
    const member = await EntityMemberModel.findByEntityAndUser(entityId, userId);

    if (!isOwner && !member) {
      throw new ForbiddenError("Vous n'êtes pas membre de cette entité");
    }

    return entity;
  }

  async update(
    entityId: number,
    userId: number,
    data: {
      name?: string;
      type?: string;
      description?: string | null;
      logo?: string | null;
      currency?: string;
      timezone?: string;
    },
  ) {
    const entity = await this.getById(entityId, userId);
    await this.requireAdmin(entity, userId);

    const updated = await EntityModel.update(entityId, data);
    if (updated) {
      await AuditService.log(userId, entityId, 'update', 'entity', entityId, data);
    }

    return updated;
  }

  async delete(entityId: number, userId: number) {
    const entity = await this.getById(entityId, userId);
    await this.requireAdmin(entity, userId);

    const deleted = await EntityModel.delete(entityId);
    if (deleted) {
      await AuditService.log(userId, entityId, 'delete', 'entity', entityId, {
        name: entity.name,
      });
    }

    return deleted;
  }

  async addMember(
    entityId: number,
    userId: number,
    data: { user_id?: number; email?: string; role?: string },
  ) {
    const entity = await this.getById(entityId, userId);
    await this.requireAdmin(entity, userId);

    let targetUserId = data.user_id;
    if (!targetUserId && data.email) {
      const targetUser = await UserModel.findByEmail(data.email);
      if (!targetUser) {
        throw new NotFoundError('Aucun utilisateur trouvé avec cet email');
      }
      targetUserId = targetUser.id;
    }

    if (!targetUserId) {
      throw new ValidationError("Vous devez fournir un user_id ou un email");
    }

    const existingMember = await EntityMemberModel.findByEntityAndUser(entityId, targetUserId);
    if (existingMember) {
      throw new ValidationError("Cet utilisateur est déjà membre de l'entité");
    }

    const member = await EntityMemberModel.create({
      entity_id: entityId,
      user_id: targetUserId,
      role: data.role ?? 'viewer',
      status: 'pending',
    });

    await AuditService.log(userId, entityId, 'add_member', 'entity_member', member?.id ?? null, {
      target_user_id: targetUserId,
      role: data.role ?? 'viewer',
    });

    return member;
  }

  async updateMember(
    entityId: number,
    userId: number,
    memberUserId: number,
    data: { role?: string; status?: string },
  ) {
    const entity = await this.getById(entityId, userId);
    await this.requireAdmin(entity, userId);

    const member = await EntityMemberModel.findByEntityAndUser(entityId, memberUserId);
    if (!member) {
      throw new NotFoundError("Membre non trouvé dans cette entité");
    }

    const updated = await EntityMemberModel.update(member.id, data);
    if (updated) {
      await AuditService.log(userId, entityId, 'update_member', 'entity_member', member.id, data);
    }

    return updated;
  }

  async removeMember(entityId: number, userId: number, memberUserId: number) {
    const entity = await this.getById(entityId, userId);
    await this.requireAdmin(entity, userId);

    if (entity.owner_id === memberUserId) {
      throw new ValidationError("Impossible de supprimer le propriétaire de l'entité");
    }

    const member = await EntityMemberModel.findByEntityAndUser(entityId, memberUserId);
    if (!member) {
      throw new NotFoundError("Membre non trouvé dans cette entité");
    }

    const deleted = await EntityMemberModel.delete(member.id);
    if (deleted) {
      await AuditService.log(userId, entityId, 'remove_member', 'entity_member', member.id, {
        removed_user_id: memberUserId,
      });
    }

    return deleted;
  }

  async getMembers(entityId: number, userId: number) {
    await this.getById(entityId, userId);
    return EntityMemberModel.findByEntity(entityId);
  }

  private async requireAdmin(entity: { id: number; owner_id: number }, userId: number) {
    if (entity.owner_id === userId) return;

    const member = await EntityMemberModel.findByEntityAndUser(entity.id, userId);
    if (!member || member.role !== 'admin') {
      throw new ForbiddenError("Vous devez être administrateur pour effectuer cette action");
    }
  }
}

export default new EntityService();
