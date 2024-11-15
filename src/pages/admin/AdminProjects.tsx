import { useState } from "react";
import { Input } from "@/components/ui/input";
import ProjectListHeader from "@/components/admin/projects/ProjectListHeader";
import ProjectListItem from "@/components/admin/projects/ProjectListItem";

// Demo data
const demoProjects = [
  {
    id: 1,
    name: "Eco-Friendly Packaging",
    client: "Green Earth Co",
    email: "contact@greenearth.co",
    phone: "+1 (555) 123-4567",
    status: "active",
    progress: 65,
    accountManager: "Sarah Johnson",
    points: 850,
    lastUpdate: "Product selection phase completed",
    updatedAt: "2024-02-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Premium Beauty Line",
    client: "Luxe Beauty",
    email: "projects@luxebeauty.com",
    phone: "+1 (555) 987-6543",
    status: "pending",
    progress: 25,
    accountManager: "Michael Chen",
    points: 1200,
    lastUpdate: "Initial consultation scheduled",
    updatedAt: "2024-02-14T15:45:00Z"
  },
  {
    id: 3,
    name: "Organic Food Packaging",
    client: "Nature's Best",
    email: "info@naturesbest.com",
    phone: "+1 (555) 456-7890",
    status: "completed",
    progress: 100,
    accountManager: "Emily Rodriguez",
    points: 950,
    lastUpdate: "Final delivery approved",
    updatedAt: "2024-02-13T09:15:00Z"
  }
];

const AdminProjects = () => {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects Management</h1>
        <Input
          placeholder="Search projects..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <ProjectListHeader />
        
        {demoProjects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            isExpanded={expandedProjects.includes(project.id)}
            onToggle={() => toggleProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;