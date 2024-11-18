export interface Project {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  points: number | null;
  points_used: number | null;
  pack_type: "start" | "pro" | "ultra";
  cover_image_url: string | null;
}