import { useState } from "react";
import { ProjectListHeader } from "@/components/admin/projects/ProjectListHeader";
import { ProjectFilters } from "@/components/admin/projects/ProjectFilters";
import { ProjectCard } from "@/components/admin/projects/ProjectCard";

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
  }
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
          <ProjectFilters
            statusFilter={statusFilter}
            managerFilter={managerFilter}
            onStatusChange={setStatusFilter}
            onManagerChange={setManagerFilter}
            uniqueManagers={uniqueManagers}
          />
        </div>

        <div className="grid gap-4">
          <ProjectListHeader />
          
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              expanded={expandedProject === project.id}
              onToggle={() => toggleProject(project.id)}
              pointsToAdd={pointsToAdd}
              onPointsChange={setPointsToAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;