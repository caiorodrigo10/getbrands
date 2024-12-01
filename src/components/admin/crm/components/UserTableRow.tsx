import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { CRMUser } from "../types";

interface UserTableRowProps {
  user: CRMUser;
  isSelected: boolean;
  onSelect: (userId: string, checked: boolean) => void;
  onEdit: (user: CRMUser) => void;
}

export const UserTableRow = ({ user, isSelected, onSelect, onEdit }: UserTableRowProps) => {
  const getUserTypeBadge = (role: string | null, hasProjects: boolean) => {
    const effectiveType = hasProjects ? "customer" : role || "lead";

    const styles = {
      lead: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      member: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      sampler: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      customer: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      admin: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    }[effectiveType] || "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";

    const labels = {
      lead: "Lead",
      member: "Member",
      sampler: "Sampler",
      customer: "Customer",
      admin: "Admin"
    };

    return (
      <Badge className={`${styles} transition-colors`} variant="outline">
        {labels[effectiveType as keyof typeof labels] || "Unknown"}
      </Badge>
    );
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(user.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        {[user.first_name, user.last_name].filter(Boolean).join(" ")}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phone || "-"}</TableCell>
      <TableCell>
        {getUserTypeBadge(user.role, Array.isArray(user.projects) && user.projects.length > 0)}
      </TableCell>
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
        {user.created_at
          ? formatDistanceToNow(new Date(user.created_at), {
              addSuffix: true,
            })
          : "-"}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(user)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};