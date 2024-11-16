export type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

export interface Task {
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: string;
}

export interface Stage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
}