import { useRef } from "react";
import { Task, Stage } from "../StagesTimeline";
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
import Sortable from "sortablejs";

interface StagesListProps {
  stages: Stage[];
  openStages: string[];
  onToggleStage: (stageId: string) => void;
  onTaskUpdate: (stageId: string, taskId: string, updates: Partial<Task>) => void;
  onAddTask: (stageId: string, taskData: Task) => Promise<void>;
  onDeleteTask: (stageId: string, taskId: string) => void;
  onDeleteStage: (stageId: string) => void;
  onUpdateTaskPositions: (stageId: string, tasks: Task[]) => Promise<void>;
}

export const StagesList = ({
  stages,
  openStages,
  onToggleStage,
  onTaskUpdate,
  onAddTask,
  onDeleteTask,
  onDeleteStage,
  onUpdateTaskPositions,
}: StagesListProps) => {
  const tasksContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const initializeSortable = (stageId: string, container: HTMLDivElement) => {
    tasksContainerRefs.current[stageId] = container;
    
    new Sortable(container, {
      animation: 150,
      handle: ".task-handle",
      group: "tasks",
      onEnd: async (evt) => {
        const stageId = evt.to.getAttribute('data-stage-id');
        if (!stageId) return;

        const stage = stages.find(s => s.id === stageId);
        if (!stage) return;

        const updatedTasks = Array.from(evt.to.children).map((el, index) => {
          const taskId = el.getAttribute('data-task-id');
          const task = stage.tasks.find(t => t.id === taskId);
          return {
            ...task!,
            position: index,
            stageId,
          };
        });

        await onUpdateTaskPositions(stageId, updatedTasks);
      },
    });
  };

  return (
    <Accordion type="multiple" value={openStages}>
      {stages.map((stage) => (
        <AccordionItem 
          key={stage.id} 
          value={stage.id}
          className="border rounded-lg bg-card"
        >
          <div className="flex items-center justify-between px-4">
            <AccordionTrigger 
              className="flex-1 py-4 hover:no-underline stage-handle cursor-move"
              onClick={() => onToggleStage(stage.id)}
            >
              <StageHeader name={stage.name} status={stage.status} />
            </AccordionTrigger>
            <StageActions onDeleteStage={() => onDeleteStage(stage.id)} />
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
                
                <div 
                  ref={(el) => el && initializeSortable(stage.id, el)}
                  data-stage-id={stage.id}
                  className="space-y-1"
                >
                  {stage.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      {...task}
                      onUpdate={(updates) => onTaskUpdate(stage.id, task.id, updates)}
                      onDelete={() => onDeleteTask(stage.id, task.id)}
                    />
                  ))}
                </div>
                
                <AddTaskButton 
                  stageName={stage.name}
                  onAddTask={(taskData) => onAddTask(stage.id, taskData)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};