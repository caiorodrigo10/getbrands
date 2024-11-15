import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Demo data
const demoProjects = [
  {
    id: 1,
    name: "Eco-Friendly Packaging",
    status: "In Progress",
    completion: 65,
    client: {
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567"
    },
    accountManager: "Sarah Johnson",
    registrationDate: "2024-01-15",
    projectStartDate: "2024-02-01",
    points: 850
  },
  {
    id: 2,
    name: "Premium Beauty Line",
    status: "Design Phase",
    completion: 30,
    client: {
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 987-6543"
    },
    accountManager: "Michael Brown",
    registrationDate: "2024-02-10",
    projectStartDate: "2024-02-20",
    points: 1200
  },
  {
    id: 3,
    name: "Organic Food Packaging",
    status: "Review",
    completion: 90,
    client: {
      name: "Robert Wilson",
      email: "robert@example.com",
      phone: "(555) 456-7890"
    },
    accountManager: "Lisa Anderson",
    registrationDate: "2024-01-05",
    projectStartDate: "2024-01-15",
    points: 750
  }
];

const AdminProjects = () => {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      
      <div className="space-y-4">
        {demoProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                    <span className="text-sm text-muted-foreground">{project.status}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Completion</div>
                  <div className="mt-1 relative h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                  <div className="text-sm mt-1">{project.completion}%</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Client</div>
                  <div className="font-medium">{project.client.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {project.client.email}<br />
                    {project.client.phone}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Account Manager</div>
                  <div className="font-medium">{project.accountManager}</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleProject(project.id)}
                className="ml-4"
              >
                {expandedProject === project.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {expandedProject === project.id && (
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
                            onChange={(e) => setPointsToAdd(Number(e.target.value))}
                            min="0"
                          />
                        </div>
                        <Button className="w-full" onClick={() => setPointsToAdd(0)}>
                          Add Points
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;