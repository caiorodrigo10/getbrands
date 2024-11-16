import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { TaskItem } from "./stages/TaskItem";
import { StageHeader } from "./stages/StageHeader";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";
type AssigneeType = "client" | "account_manager" | "designer" | "none";

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

const stages: Stage[] = [
  {
    name: "Onboarding",
    status: "completed",
    tasks: [
      { 
        name: "Welcome Meeting",
        status: "done",
        date: "10/03/2024",
        startDate: new Date("2024-03-10"),
        endDate: new Date("2024-03-10"),
        assignee: "account_manager"
      }
    ]
  },
  {
    name: "Product Selection",
    status: "completed",
    tasks: [
      {
        name: "Client Successfully Selected Products",
        status: "done",
        date: "15/03/2024",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-15"),
        assignee: "client"
      }
    ]
  },
  {
    name: "Naming",
    status: "in-progress",
    tasks: [
      {
        name: "Client Fill Naming Brief Form",
        status: "done",
        date: "18/03/2024",
        startDate: new Date("2024-03-18"),
        endDate: new Date("2024-03-18"),
        assignee: "client"
      },
      {
        name: "Team Archived Name Options for Client",
        status: "in_progress",
        date: "In Progress",
        startDate: new Date("2024-03-20"),
        assignee: "designer"
      },
      {
        name: "Client Approved Name",
        status: "todo",
        assignee: "client"
      }
    ]
  },
  {
    name: "Visual Identity",
    status: "pending",
    tasks: [
      {
        name: "Client Fill Visual Identity Form",
        status: "blocked"
      },
      {
        name: "Team Completed Visual Identity and Archived Presentation",
        status: "todo"
      },
      {
        name: "Client Approved Visual Identity",
        status: "todo"
      }
    ]
  },
  {
    name: "Package Design",
    status: "pending",
    tasks: [
      {
        name: "Client Filled Brief and References",
        status: "todo"
      },
      {
        name: "Team Completed Packages and Archived Materials",
        status: "todo"
      },
      {
        name: "Client Approved Packages",
        status: "todo"
      }
    ]
  },
  {
    name: "E-commerce",
    status: "pending",
    tasks: [
      {
        name: "Client Filled E-commerce Brief",
        status: "not_included"
      },
      {
        name: "Team Created E-commerce and Configurations",
        status: "not_included"
      },
      {
        name: "Client Approved E-commerce",
        status: "not_included"
      }
    ]
  }
];

const StagesTimeline = () => {
  const handleTaskUpdate = (stageName: string, taskIndex: number, newName: string) => {
    console.log(`Updating task in stage ${stageName}, index ${taskIndex} to: ${newName}`);
    // Here you would implement the actual update logic
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {stages.map((stage) => (
        <AccordionItem 
          key={stage.name} 
          value={stage.name}
          className="border rounded-lg bg-card"
        >
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <StageHeader name={stage.name} status={stage.status} />
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="space-y-1">
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
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default StagesTimeline;
