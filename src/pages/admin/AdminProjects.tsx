import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Demo data with more projects
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
  },
  {
    id: 4,
    name: "Luxury Cosmetics",
    status: "In Progress",
    completion: 45,
    client: {
      name: "Sophie Turner",
      email: "sophie@example.com",
      phone: "(555) 234-5678"
    },
    accountManager: "Sarah Johnson",
    registrationDate: "2024-02-15",
    projectStartDate: "2024-03-01",
    points: 950
  },
  {
    id: 5,
    name: "Sustainable Packaging",
    status: "Design Phase",
    completion: 20,
    client: {
      name: "David Chen",
      email: "david@example.com",
      phone: "(555) 876-5432"
    },
    accountManager: "Michael Brown",
    registrationDate: "2024-02-20",
    projectStartDate: "2024-03-05",
    points: 1100
  },
  // ... Adding more projects with similar structure up to 15 total
].concat(Array.from({ length: 10 }, (_, i) => ({
  id: i + 6,
  name: `Project ${i + 6}`,
  status: ["In Progress", "Design Phase", "Review", "Completed"][Math.floor(Math.random() * 4)],
  completion: Math.floor(Math.random() * 100),
  client: {
    name: `Client ${i + 6}`,
    email: `client${i + 6}@example.com`,
    phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  },
  accountManager: ["Sarah Johnson", "Michael Brown", "Lisa Anderson"][Math.floor(Math.random() * 3)],
  registrationDate: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  projectStartDate: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  points: Math.floor(Math.random() * 1000) + 500
})));

const AdminProjects = () => {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [managerFilter, setManagerFilter] = useState<string>("all");

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

  const uniqueManagers = Array.from(new Set(demoProjects.map(p => p.accountManager)));
  const filteredProjects = demoProjects.filter(project => {
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesManager = managerFilter === "all" || project.accountManager === managerFilter;
    return matchesStatus && matchesManager;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Design Phase">Design Phase</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={managerFilter} onValueChange={setManagerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {uniqueManagers.map(manager => (
                  <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-3 bg-muted rounded-lg text-sm font-medium text-muted-foreground">
            <div>Project Name</div>
            <div>Client Name</div>
            <div>Status</div>
            <div>Account Manager</div>
            <div>Completion</div>
          </div>

          {filteredProjects.map((project) => (
            <Card key={project.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
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
    </div>
  );
};

export default AdminProjects;