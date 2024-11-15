import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ProjectCardProps {
  project: any;
  expanded: boolean;
  onToggle: () => void;
  pointsToAdd: number;
  onPointsChange: (value: number) => void;
}

export const ProjectCard = ({
  project,
  expanded,
  onToggle,
  pointsToAdd,
  onPointsChange,
}: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      "In Progress": "bg-blue-500",
      "Design Phase": "bg-purple-500",
      "Review": "bg-yellow-500",
      "Completed": "bg-green-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <h3 className="font-medium text-sm">{project.name}</h3>
          </div>
          
          <div>
            <div className="font-medium">{project.client.name}</div>
            <div className="text-sm text-muted-foreground">{project.client.email}</div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
              <span className="text-sm">{project.status}</span>
            </div>
          </div>

          <div>
            <div className="text-sm">{project.accountManager}</div>
          </div>

          <div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${project.completion}%` }}
              />
            </div>
            <div className="text-sm mt-1">{project.completion}%</div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-4"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground">Registration Date</div>
            <div className="font-medium">
              {new Date(project.registrationDate).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Project Start Date</div>
            <div className="font-medium">
              {new Date(project.projectStartDate).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Project Points</div>
            <div className="font-medium">{project.points}</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                  Add Points
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Points to Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Points to Add
                    </label>
                    <Input
                      type="number"
                      value={pointsToAdd}
                      onChange={(e) => onPointsChange(Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <Button className="w-full" onClick={() => onPointsChange(0)}>
                    Add Points
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </Card>
  );
};