import AuditLogModel from '../models/AuditLogModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

class AuditService {
  async list(entityId: number, userId: number, limit: number = 50, offset: number = 0) {
    await this.requireMembership(entityId, userId);
    return AuditLogModel.findByEntity(entityId, limit, offset);
  }

  async log(
    userId: number,
    entityId: number | null,
    action: string,
    resourceType: string,
    resourceId: number | null,
    details?: object | null,
    ipAddress?: string | null,
  ) {
    return AuditLogModel.create({
      user_id: userId,
      entity_id: entityId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details ?? null,
      ip_address: ipAddress ?? null,
    });
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
}

export default new AuditService();
