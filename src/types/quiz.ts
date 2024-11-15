export interface PackageQuiz {
  id: string;
  project_id: string;
  user_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  current_step: number;
  label_style?: string;
  primary_color?: string;
  secondary_color?: string;
  typography_choice?: string;
  logo_placement?: string;
  visual_elements?: string[];
  reference_labels?: string[];
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PackageQuizFile {
  id: string;
  quiz_id: string;
  file_url: string;
  file_type: string;
  created_at: string;
}