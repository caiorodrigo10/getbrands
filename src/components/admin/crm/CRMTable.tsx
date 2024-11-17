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

interface Project {
  id: string;
  name: string;
  status: string;
  pack_type: string;
}

interface CRMUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  user_type: string;
  created_at: string;
  projects: Project[] | null;
}

interface CRMTableProps {
  users: CRMUser[];
}

const getUserTypeBadge = (type: string) => {
  const styles = {
    member: "bg-gray-500",
    sampler: "bg-blue-500",
    customer: "bg-green-500",
  }[type] || "bg-gray-500";

  return <Badge className={styles}>{type}</Badge>;
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
                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};