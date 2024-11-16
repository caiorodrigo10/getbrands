import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { TaskItem } from "./stages/TaskItem";
import { StageHeader } from "./stages/StageHeader";
import { AddTaskButton } from "./stages/AddTaskButton";
import { AddStageButton } from "./stages/AddStageButton";
import { StageActions } from "./stages/StageActions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AssigneeType } from "./stages/TaskAssigneeSelect";
import { useParams } from "react-router-dom";
import { getProjectTasks, updateTaskAssignee } from "@/lib/tasks";
import { useQuery } from "@tanstack/react-query";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

interface Task {
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
}

interface Stage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
}

const calculateStageStatus = (tasks: Task[]): Stage["status"] => {
  if (tasks.length === 0) return "pending";
  
  const allCompleted = tasks.every(task => task.status === "done");
  if (allCompleted) return "completed";
  
  const hasInProgress = tasks.some(task => task.status === "in_progress");
  if (hasInProgress) return "in-progress";
  
  return "pending";
};

const StagesTimeline = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [stages, setStages] = useState<Stage[]>([]);

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: () => projectId ? getProjectTasks(projectId) : Promise.resolve([]),
    enabled: !!projectId
  });

  useEffect(() => {
    if (tasks) {
      // Group tasks by stage and convert to our Stage format
      const groupedTasks = tasks.reduce((acc: Record<string, Task[]>, task) => {
        if (!acc[task.stage_name]) {
          acc[task.stage_name] = [];
        }
        acc[task.stage_name].push({
          name: task.title,
          status: task.status as TaskStatus,
          startDate: task.start_date ? new Date(task.start_date) : undefined,
          endDate: task.due_date ? new Date(task.due_date) : undefined,
          assignee: task.assignee_id ? `admin-${task.assignee_id}` as AssigneeType : 'none'
        });
        return acc;
      }, {});

      const newStages: Stage[] = Object.entries(groupedTasks).map(([name, tasks]) => ({
        name,
        status: calculateStageStatus(tasks),
        tasks
      }));

      setStages(newStages);
    }
  }, [tasks]);

  const handleTaskUpdate = async (stageName: string, taskIndex: number, newName: string) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const updatedTasks = [...stage.tasks];
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], name: newName };
          return {
            ...stage,
            tasks: updatedTasks,
            status: calculateStageStatus(updatedTasks)
          };
        }
        return stage;
      })
    );
  };

  const handleTaskAssigneeChange = async (stageName: string, taskName: string, newAssignee: AssigneeType) => {
    if (!projectId) return;

    try {
      await updateTaskAssignee(
        projectId,
        stageName,
        taskName,
        newAssignee === 'none' ? null : newAssignee
      );
      await refetchTasks();
      toast.success("Task assignee updated successfully");
    } catch (error) {
      console.error('Error updating task assignee:', error);
      toast.error("Failed to update task assignee");
    }
  };

  const handleAddTask = async (stageName: string, taskData: any) => {
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const newTasks = [...stage.tasks, taskData];
          return {
            ...stage,
            tasks: newTasks,
            status: calculateStageStatus(newTasks)
          };
        }
        return stage;
      })
    );
    toast.success("Task added successfully");
  };

  const handleDeleteTask = async (stageName: string, taskIndex: number) => {
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const newTasks = stage.tasks.filter((_, index) => index !== taskIndex);
          return {
            ...stage,
            tasks: newTasks,
            status: calculateStageStatus(newTasks)
          };
        }
        return stage;
      })
    );
    toast.success("Task deleted successfully");
  };

  const handleAddStage = async (stageName: string) => {
    setStages(prevStages => [
      ...prevStages,
      {
        name: stageName,
        status: "pending",
        tasks: []
      }
    ]);
    toast.success("Stage added successfully");
  };

  const handleDeleteStage = async (stageName: string) => {
    setStages(prevStages => prevStages.filter(stage => stage.name !== stageName));
    toast.success("Stage deleted successfully");
  };

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {stages.map((stage) => (
          <AccordionItem 
            key={stage.name} 
            value={stage.name}
            className="border rounded-lg bg-card"
          >
            <div className="flex items-center justify-between px-4">
              <AccordionTrigger className="flex-1 hover:no-underline">
                <StageHeader name={stage.name} status={stage.status} />
              </AccordionTrigger>
              <StageActions onDeleteStage={() => handleDeleteStage(stage.name)} />
            </div>
            <AccordionContent className="pb-3">
              <div className="space-y-1">
                <div className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <div>Task</div>
                  <div>Status</div>
                  <div>Assignee</div>
                  <div>Start</div>
                  <div>End</div>
                </div>
                
                {stage.tasks.map((task, taskIndex) => (
                  <TaskItem
                    key={taskIndex}
                    name={task.name}
                    status={task.status}
                    date={task.date}
                    startDate={task.startDate}
                    endDate={task.endDate}
                    assignee={task.assignee}
                    onUpdate={(newName) => handleTaskUpdate(stage.name, taskIndex, newName)}
                    onDelete={() => handleDeleteTask(stage.name, taskIndex)}
                    onAssigneeChange={(newAssignee) => handleTaskAssigneeChange(stage.name, task.name, newAssignee)}
                  />
                ))}
                
                <AddTaskButton 
                  stageName={stage.name}
                  onAddTask={(taskData) => handleAddTask(stage.name, taskData)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <AddStageButton onAddStage={handleAddStage} />
    </div>
  );
};

export default StagesTimeline;
