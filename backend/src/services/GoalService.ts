import GoalModel from '../models/GoalModel.js';
import EntityModel from '../models/EntityModel.js';
import EntityMemberModel from '../models/EntityMemberModel.js';
import NotificationModel from '../models/NotificationModel.js';
import AuditService from './AuditService.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../utils/errors.js';

class GoalService {
  async list(entityId: number, userId: number) {
    await this.requireMembership(entityId, userId);
    return GoalModel.findByEntity(entityId);
  }

  async create(
    entityId: number,
    userId: number,
    data: {
      name: string;
      target_amount: number;
      current_amount?: number;
      deadline?: string | null;
      status?: string;
      description?: string | null;
    },
  ) {
    if (data.target_amount <= 0) {
      throw new ValidationError('Le montant cible doit être supérieur à 0');
    }

    await this.requireManager(entityId, userId);

    const goal = await GoalModel.create({ ...data, entity_id: entityId });
    if (!goal) {
      throw new Error("Échec de la création de l'objectif");
    }

    await AuditService.log(userId, entityId, 'create', 'goal', goal.id, {
      name: goal.name,
      target_amount: goal.target_amount,
    });

    return goal;
  }

  async update(
    goalId: number,
    userId: number,
    data: {
      name?: string;
      target_amount?: number;
      current_amount?: number;
      deadline?: string | null;
      status?: string;
      description?: string | null;
    },
  ) {
    const goal = await GoalModel.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Objectif non trouvé');
    }

    await this.requireManager(goal.entity_id, userId);

    if (data.target_amount !== undefined && data.target_amount <= 0) {
      throw new ValidationError('Le montant cible doit être supérieur à 0');
    }

    const oldStatus = goal.status;

    const updated = await GoalModel.update(goalId, data);
    if (!updated) {
      throw new Error("Échec de la mise à jour de l'objectif");
    }

    const newStatus = data.status ?? oldStatus;

    if (newStatus === 'completed' && oldStatus !== 'completed') {
      const members = await EntityMemberModel.findByEntity(goal.entity_id);
      for (const member of members) {
        await NotificationModel.create({
          user_id: member.user_id,
          entity_id: goal.entity_id,
          type: 'goal_completed',
          title: 'Objectif atteint',
          message: `L'objectif "${goal.name}" a été atteint avec succès !`,
        });
      }
    }

    await AuditService.log(userId, goal.entity_id, 'update', 'goal', goalId, data);

    return GoalModel.findById(goalId);
  }

  async delete(goalId: number, userId: number) {
    const goal = await GoalModel.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Objectif non trouvé');
    }

    await this.requireManager(goal.entity_id, userId);

    const deleted = await GoalModel.delete(goalId);
    if (deleted) {
      await AuditService.log(userId, goal.entity_id, 'delete', 'goal', goalId, {
        name: goal.name,
      });
    }

    return deleted;
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

export default new GoalService();
