import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PACK_LABELS } from "@/types/project";

interface FormattedProject {
  id: string;
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
  pack_type: 'start' | 'pro' | 'ultra';
}

interface AdminProjectsTableProps {
  projects: FormattedProject[];
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

  const getPackColor = (pack_type: 'start' | 'pro' | 'ultra') => {
    switch (pack_type) {
      case "start":
        return "bg-blue-500/10 text-blue-500";
      case "pro":
        return "bg-purple-500/10 text-purple-500";
      case "ultra":
        return "bg-amber-500/10 text-amber-500";
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
            <TableHead>Pack</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.accountManager}</p>
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
                <Badge className={getPackColor(project.pack_type)}>
                  {PACK_LABELS[project.pack_type]}
                </Badge>
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/admin/projects/${project.id}/manage`)}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProjectsTable;