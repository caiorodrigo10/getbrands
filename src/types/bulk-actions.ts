export type BulkActionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type BulkActionType = 'import' | 'delete';

export interface BulkAction {
  id: string;
  action_type: BulkActionType;
  entity_type: string;
  status: BulkActionStatus;
  details: any;
  file_url?: string;
  created_by?: string;
  affected_records?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}