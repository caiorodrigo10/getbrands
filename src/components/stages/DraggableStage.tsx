import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Stage } from "../StagesTimeline";
import { StageHeader } from "./StageHeader";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "./AddTaskButton";
import { Card } from "../ui/card";
import { Task } from "../StagesTimeline";

interface DraggableStageProps {
  stage: Stage;
  isOpen: boolean;
  onToggle: () => void;
  onTaskUpdate: (taskIndex: number, updates: Partial<Task>) => void;
  onAddTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskIndex: number) => void;
  onDeleteStage: () => void;
  onUpdateStage: (oldName: string, newName: string, newStatus: Stage["status"]) => void;
  isAdmin?: boolean;
}

export const DraggableStage = ({
  stage,
  isOpen,
  onToggle,
  onTaskUpdate,
  onAddTask,
  onDeleteTask,
  onDeleteStage,
  onUpdateStage,
  isAdmin,
}: DraggableStageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden">
        <div {...attributes} {...listeners}>
          <StageHeader
            name={stage.name}
            status={stage.status}
            isOpen={isOpen}
            onToggle={onToggle}
            onDelete={onDeleteStage}
            onUpdate={onUpdateStage}
            isAdmin={isAdmin}
            isDraggable
          />
        </div>
        
        {isOpen && (
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
                onUpdate={(updates) => onTaskUpdate(index, updates)}
                onDelete={() => onDeleteTask(index)}
              />
            ))}
            <AddTaskButton
              stageName={stage.name}
              onAddTask={onAddTask}
            />
          </div>
        )}
      </Card>
    </div>
  );
};