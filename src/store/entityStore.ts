import { create } from 'zustand';
import { entityApi } from '../services/api';
import type { Entity } from '../types';

interface EntityStore {
  currentEntity: Entity | null;
  entities: Entity[];
  loading: boolean;
  setCurrentEntity: (entity: Entity | null) => void;
  fetchEntities: () => Promise<void>;
  fetchEntity: (id: number) => Promise<void>;
}

const useEntityStore = create<EntityStore>((set) => ({
  currentEntity: null,
  entities: [],
  loading: false,
  setCurrentEntity: (entity) => set({ currentEntity: entity }),
  fetchEntities: async () => {
    set({ loading: true });
    try {
      const res = await entityApi.list();
      const entities = res.data?.data || [];
      const current = entities.find((e) => e.id === get().currentEntity?.id) || entities[0] || null;
      set({ entities, loading: false, currentEntity: current });
    } catch {
      set({ loading: false });
    }
  },
  fetchEntity: async (id) => {
    try {
      const res = await entityApi.getById(id);
      set({ currentEntity: res.data?.data || null });
    } catch {
      // ignore
    }
  },
}));

export default useEntityStore;
