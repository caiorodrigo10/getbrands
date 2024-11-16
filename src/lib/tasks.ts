import { supabase } from "@/integrations/supabase/client";
import { AssigneeType } from "@/components/stages/TaskAssigneeSelect";

export const updateTaskAssignee = async (
  projectId: string,
  stageName: string,
  taskName: string,
  assigneeId: string | null
) => {
  const { error } = await supabase
    .from('project_tasks')
    .update({ 
      assignee_id: assigneeId ? assigneeId.replace('admin-', '') : null 
    })
    .eq('project_id', projectId)
    .eq('stage_name', stageName)
    .eq('title', taskName);

  if (error) throw error;
};

export const getProjectTasks = async (projectId: string) => {
  const { data, error } = await supabase
    .from('project_tasks')
    .select(`
      *,
      assignee:profiles(*)
    `)
    .eq('project_id', projectId)
    .order('created_at');

  if (error) throw error;
  return data;
};