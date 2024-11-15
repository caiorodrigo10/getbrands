import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProjectProgress from "@/components/ProjectProgress";
import { ChevronDown, ChevronUp, PlusCircle, User, Mail, Phone, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500";
      case "pending":
        return "bg-amber-500/10 text-amber-500";
      case "completed":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
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

      <div className="grid gap-4">
        {demoProjects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="space-y-4">
              {/* Main Project Info */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProject(project.id)}
                      className="ml-2"
                    >
                      {expandedProjects.includes(project.id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-2" />
                        {project.client}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        {project.email}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        {project.phone}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1",
                          getStatusColor(project.status)
                        )}>
                          {getStatusIcon(project.status)}
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Account Manager: {project.accountManager}
                      </div>
                    </div>

                    <div>
                      <ProjectProgress progress={project.progress} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Project Details */}
              {expandedProjects.includes(project.id) && (
                <div className="mt-4 pt-4 border-t border-border/40 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Project Points</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">{project.points}</span>
                        <Button size="sm" variant="outline" className="h-8">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Points
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Latest Update</h3>
                      <p className="text-sm text-muted-foreground">{project.lastUpdate}</p>
                      <time className="text-xs text-muted-foreground block mt-1">
                        {new Date(project.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;