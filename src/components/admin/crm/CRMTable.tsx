import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type CRMViewRow = Database["public"]["Views"]["crm_view"]["Row"];

interface Project {
  id: string;
  name: string;
  status: string | null;
  pack_type: Database["public"]["Enums"]["project_pack_type"];
}

interface CRMUser extends Omit<CRMViewRow, 'projects'> {
  projects: Project[] | null;
}

interface CRMTableProps {
  users: CRMUser[];
}

const getUserTypeBadge = (type: string | null) => {
  const styles = {
    member: "bg-gray-500",
    sampler: "bg-blue-500",
    customer: "bg-green-500",
  }[type || "member"] || "bg-gray-500";

  return <Badge className={styles}>{type || "member"}</Badge>;
};

export const CRMTable = ({ users }: CRMTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Member Since</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {[user.first_name, user.last_name].filter(Boolean).join(" ")}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {user.projects?.map((project) => (
                    <div key={project.id} className="text-sm">
                      {project.name}
                    </div>
                  )) || "-"}
                </div>
              </TableCell>
              <TableCell>
                {user.created_at ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};