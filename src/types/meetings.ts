export interface ProjectMeeting {
  id: string;
  project_id: string;
  user_id: string;
  scheduled_for: string;
  scheduled_at: string;
  meeting_link?: string;
  status: string;
  created_at: string;
  updated_at: string;
}