import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, Square } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const ProjectDetailsV2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project-v2", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          user:profiles (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["project-tasks-v2", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          *,
          assignee:profiles (
            id,
            first_name,
            last_name
          )
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingProject || isLoadingTasks) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group tasks by stage
  const stages = tasks?.reduce((acc, task) => {
    const stage = acc.find(s => s.name === task.stage_name);
    if (stage) {
      stage.tasks.push(task);
    } else {
      acc.push({
        name: task.stage_name,
        tasks: [task],
        status: calculateStageStatus(task.stage_name, tasks)
      });
    }
    return acc;
  }, [] as { name: string; tasks: any[]; status: "completed" | "in-progress" | "pending" }[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/projects')}
              className="gap-2"
            >
              Back to Projects
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{project?.name}</h1>
          <p className="text-muted-foreground mt-1">{project?.description}</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">
          {project?.status === 'em_andamento' ? 'Active' : 'Completed'}
        </Badge>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-full bg-muted/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${calculateProgress(stages)}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[40px]">
            {calculateProgress(stages)}%
          </span>
        </div>
        
        <Separator className="my-6" />
        
        <Accordion type="multiple" className="w-full space-y-4">
          {stages.map((stage) => (
            <AccordionItem 
              key={stage.name} 
              value={stage.name}
              className="border rounded-lg bg-card"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`relative flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                    stage.status === "completed" 
                      ? "border-primary bg-primary text-white" 
                      : stage.status === "in-progress"
                      ? "border-primary-light bg-primary-light/10"
                      : "border-muted bg-muted/10"
                  }`}>
                    {stage.status === "completed" ? (
                      <Check className="w-3 h-3" />
                    ) : stage.status === "in-progress" ? (
                      <Clock className="w-3 h-3 text-primary-light" />
                    ) : (
                      <Square className="w-3 h-3 text-muted" />
                    )}
                  </div>
                  <span className="font-medium">{stage.name}</span>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-1">
                  <div className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 py-2 text-sm font-medium text-muted-foreground">
                    <div>Task</div>
                    <div>Status</div>
                    <div>Assignee</div>
                    <div>Start</div>
                    <div>End</div>
                  </div>
                  
                  {stage.tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 items-center px-4 py-2 rounded-md hover:bg-muted/5"
                    >
                      <div className="font-medium">{task.title}</div>
                      <div>
                        <Badge variant={getStatusVariant(task.status)}>
                          {formatStatus(task.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

const calculateStageStatus = (stageName: string, tasks: any[]) => {
  const stageTasks = tasks.filter(t => t.stage_name === stageName);
  if (stageTasks.length === 0) return "pending";
  
  const allCompleted = stageTasks.every(task => task.status === "done");
  if (allCompleted) return "completed";
  
  const hasInProgress = stageTasks.some(task => task.status === "in_progress");
  if (hasInProgress) return "in-progress";
  
  return "pending";
};

const calculateProgress = (stages: { status: string }[]) => {
  if (stages.length === 0) return 0;
  
  const completed = stages.filter(s => s.status === "completed").length;
  return Math.round((completed / stages.length) * 100);
};

const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  switch (status) {
    case "done":
      return "outline";
    case "in_progress":
      return "default";
    case "blocked":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default ProjectDetailsV2;