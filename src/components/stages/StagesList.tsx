import { Task } from "../StagesTimeline";
import { TaskItem } from "./TaskItem";
import { StageHeader } from "./StageHeader";
import { AddTaskButton } from "./AddTaskButton";
import { StageActions } from "./StageActions";
import { 
  Accordion, 
  AccordionItem,
  AccordionContent,
  AccordionTrigger 
} from "../ui/accordion";

interface Stage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
}

interface StagesListProps {
  stages: Stage[];
  openStages: string[];
  onToggleStage: (stageName: string) => void;
  onTaskUpdate: (stageName: string, taskIndex: number, updates: Partial<Task>) => void;
  onAddTask: (stageName: string, taskData: Task) => void;
  onDeleteTask: (stageName: string, taskIndex: number) => void;
  onDeleteStage: (stageName: string) => void;
}

export const StagesList = ({
  stages,
  openStages,
  onToggleStage,
  onTaskUpdate,
  onAddTask,
  onDeleteTask,
  onDeleteStage,
}: StagesListProps) => {
  return (
    <Accordion type="multiple" value={openStages}>
      {stages.map((stage) => (
        <AccordionItem 
          key={stage.name} 
          value={stage.name}
          className="border rounded-lg bg-card"
        >
          <div className="flex items-center justify-between px-4">
            <AccordionTrigger 
              className="flex-1 py-4 hover:no-underline"
              onClick={() => onToggleStage(stage.name)}
            >
              <StageHeader name={stage.name} status={stage.status} />
            </AccordionTrigger>
            <StageActions onDeleteStage={() => onDeleteStage(stage.name)} />
          </div>
          <AccordionContent>
            <div className="pb-3">
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
                    {...task}
                    onUpdate={(updates) => onTaskUpdate(stage.name, taskIndex, updates)}
                    onDelete={() => onDeleteTask(stage.name, taskIndex)}
                  />
                ))}
                
                <AddTaskButton 
                  stageName={stage.name}
                  onAddTask={(taskData) => onAddTask(stage.name, taskData)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};