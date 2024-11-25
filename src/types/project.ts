export type ProjectPackType = 'start' | 'pro' | 'ultra';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  pack_type: ProjectPackType;
  points: number;
  points_used: number;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export const PACK_POINTS = {
  start: 3000,
  pro: 6000,
  ultra: 10000
} as const;

export const PACK_LABELS = {
  start: 'Start Pack',
  pro: 'Pro Pack',
  ultra: 'Ultra Pack'
} as const;