import { Stage, Task } from "../StagesTimeline";
import { StageHeader } from "./StageHeader";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "./AddTaskButton";
import { Card } from "@/components/ui/card";

interface StagesListProps {
  stages: Stage[];
  openStages: string[];
  onToggleStage: (stageName: string) => void;
  onTaskUpdate: (stageName: string, taskIndex: number, updates: Partial<Task>) => void;
  onAddTask: (stageName: string, task: Task) => Promise<void>;
  onDeleteTask: (stageName: string, taskIndex: number) => void;
  onDeleteStage: (stageName: string) => void;
  onUpdateStage: (oldStageName: string, newStageName: string, newStatus: Stage["status"]) => void;
  isAdmin?: boolean;
}

export const StagesList = ({
  stages,
  openStages,
  onToggleStage,
  onTaskUpdate,
  onAddTask,
  onDeleteTask,
  onDeleteStage,
  onUpdateStage,
  isAdmin = false,
}: StagesListProps) => {
  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <Card key={stage.name} className="overflow-hidden">
          <StageHeader
            name={stage.name}
            status={stage.status}
            isOpen={openStages.includes(stage.name)}
            onToggle={() => onToggleStage(stage.name)}
            onDelete={() => onDeleteStage(stage.name)}
            onUpdate={onUpdateStage}
            isAdmin={isAdmin}
          />
          
          {openStages.includes(stage.name) && (
            <div className="p-4 space-y-4">
              {stage.tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  name={task.name}
                  status={task.status}
                  startDate={task.startDate}
                  endDate={task.endDate}
                  assignee={task.assignee}
                  onUpdate={(updates) => onTaskUpdate(stage.name, index, updates)}
                  onDelete={() => onDeleteTask(stage.name, index)}
                />
              ))}
              <AddTaskButton
                stageName={stage.name}
                onAddTask={async (task) => await onAddTask(stage.name, task)}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};