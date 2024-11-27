export type PageViewProperties = {
  initial_load: boolean;
  route_change: boolean;
  url: string;
  referrer: string | null;
  session_id: string;
  user_role: string;
  page_type: string;
  time_on_page?: number;
  scroll_depth?: number;
  cta_visibility?: boolean;
  previous_page_type?: string;
  navigation_source?: string;
  time_since_last_interaction?: number;
};

export type UserProperties = {
  email: string;
  name: string;
  role: string;
  signup_date: string;
  referral_code?: string;
  signup_completion_time?: number;
  signup_step_abandoned?: string;
};

export type OnboardingProperties = {
  current_step: number;
  steps_completed: number;
  total_steps: number;
  time_spent: number;
  abandonment_point?: string;
  abandonment_reason?: string;
};

export type EcommerceProperties = {
  product_id?: string;
  user_id: string;
  cart_id?: string;
  item_count?: number;
  cart_total?: number;
  action?: 'add' | 'update' | 'remove';
  cart_value?: number;
  abandonment_time?: string;
  wishlist_count?: number;
};

export type CatalogProperties = {
  search_term?: string;
  filters_applied?: Record<string, any>;
  search_results_count?: number;
  search_position?: number;
  compared_products?: string[];
  comparison_duration?: number;
};

export type EngagementProperties = {
  hovered_element?: string;
  hover_duration?: number;
  page_url: string;
  video_id?: string;
  watch_time?: number;
  completion_percentage?: number;
  feature_name?: string;
  last_interaction_time?: string;
  error_code?: string;
};

export type ProjectProperties = {
  project_id: string;
  task_completion_rate: number;
  average_task_time: number;
  user_feedback?: string;
};

export type QuizProperties = {
  quiz_id: string;
  time_spent_on_question: number;
  skipped_questions: string[];
};

export type ErrorProperties = {
  error_type: string;
  error_message: string;
  error_stack?: string;
  error_retry_count?: number;
  component?: string;
  action?: string;
};