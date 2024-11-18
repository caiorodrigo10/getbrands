import { Stage, Task } from "../StagesTimeline";
import { DraggableStage } from "./DraggableStage";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface StagesListProps {
  stages: Stage[];
  openStages: string[];
  onToggleStage: (stageName: string) => void;
  onTaskUpdate: (stageName: string, taskIndex: number, updates: Partial<Task>) => void;
  onAddTask: (stageName: string, task: Task) => Promise<void>;
  onDeleteTask: (stageName: string, taskIndex: number) => void;
  onDeleteStage: (stageName: string) => void;
  onUpdateStage: (oldStageName: string, newStageName: string, newStatus: Stage["status"]) => void;
  onReorderStages: (stages: Stage[]) => void;
  isAdmin?: boolean;
  projectId?: string;
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
  onReorderStages,
  isAdmin = false,
  projectId,
}: StagesListProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = stages.findIndex((s) => s.name === active.id);
      const newIndex = stages.findIndex((s) => s.name === over.id);
      
      const newStages = arrayMove(stages, oldIndex, newIndex);
      onReorderStages(newStages);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={stages.map(s => s.name)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {stages.map((stage) => (
            <DraggableStage
              key={stage.name}
              stage={stage}
              isOpen={openStages.includes(stage.name)}
              onToggle={() => onToggleStage(stage.name)}
              onTaskUpdate={(taskIndex, updates) =>
                onTaskUpdate(stage.name, taskIndex, updates)
              }
              onAddTask={(task) => onAddTask(stage.name, task)}
              onDeleteTask={(taskIndex) => onDeleteTask(stage.name, taskIndex)}
              onDeleteStage={() => onDeleteStage(stage.name)}
              onUpdateStage={onUpdateStage}
              isAdmin={isAdmin}
              projectId={projectId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};