import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

interface Task {
  name: string;
  status: TaskStatus;
  date?: string;
}

interface Stage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "blocked":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "done":
      return <Check className="w-4 h-4 text-green-500" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "scheduled":
      return <Calendar className="w-4 h-4 text-purple-500" />;
    case "not_included":
      return <Ban className="w-4 h-4 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

const getStatusBadge = (status: TaskStatus) => {
  const styles = {
    blocked: "bg-red-100 text-red-800",
    todo: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    scheduled: "bg-purple-100 text-purple-800",
    not_included: "bg-gray-100 text-gray-800",
  };

  const labels = {
    blocked: "Blocked",
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
    scheduled: "Scheduled",
    not_included: "Not Included",
  };

  return (
    <Badge className={`${styles[status]} font-medium`}>
      {labels[status]}
    </Badge>
  );
};

const stages: Stage[] = [
  {
    name: "Onboarding",
    status: "completed",
    tasks: [
      { 
        name: "Welcome Meeting",
        status: "done",
        date: "10/03/2024"
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
        date: "15/03/2024"
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
        date: "18/03/2024"
      },
      {
        name: "Team Archived Name Options for Client",
        status: "in_progress",
        date: "In Progress"
      },
      {
        name: "Client Approved Name",
        status: "todo"
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
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {stages.map((stage) => (
        <AccordionItem 
          key={stage.name} 
          value={stage.name}
          className="border rounded-lg bg-card"
        >
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-3 w-full">
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
                  <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <span className={`text-sm font-medium ${
                  stage.status === "completed" ? "text-foreground" :
                  stage.status === "in-progress" ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {stage.name}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="pl-8 space-y-3">
              {stage.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex items-center justify-between gap-4 p-2 rounded-md bg-background/50">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className="text-sm">{task.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.date && (
                      <span className="text-xs text-muted-foreground">
                        {task.date}
                      </span>
                    )}
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default StagesTimeline;