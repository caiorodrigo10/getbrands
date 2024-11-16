import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  client: string;
  email: string;
  phone: string;
  status: string;
  progress: number;
  accountManager: string;
  points: number;
  lastUpdate: string;
  updatedAt: string;
  image: string;
}

interface AdminProjectsTableProps {
  projects: Project[];
}

const AdminProjectsTable = ({ projects }: AdminProjectsTableProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No projects found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Points</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.accountManager}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{project.client}</p>
                  <p className="text-sm text-muted-foreground">{project.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-2 w-full bg-muted/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[40px]">
                    {project.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-primary" />
                  <span>{project.points}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/projects/${project.id}`)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProjectsTable;