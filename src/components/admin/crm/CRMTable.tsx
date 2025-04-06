
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { UserProfileEditModal } from "./UserProfileEditModal";
import { Checkbox } from "@/components/ui/checkbox";
import { CRMSelectionBar } from "./CRMSelectionBar";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { useQueryClient } from "@tanstack/react-query";

interface CRMUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  projects: any[] | null;
}

interface CRMTableProps {
  users: CRMUser[];
  onUserUpdated: () => void;
  totalUsers: number;
}

export const CRMTable = ({ users, onUserUpdated, totalUsers }: CRMTableProps) => {
  const [selectedUser, setSelectedUser] = useState<CRMUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setSelectAllPages(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
      setSelectAllPages(false);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Use supabaseAdmin for permission to delete profiles
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedUsers.length} user(s)`,
      });

      // Clear selection and refresh data
      setSelectedUsers([]);
      setSelectAllPages(false);
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["crm-users"] });
      onUserUpdated();
    } catch (error: any) {
      console.error('Error deleting users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete users. Please try again.",
      });
    }
  };

  const getUserTypeBadge = (role: string | null, hasProjects: boolean) => {
    // Determine the effective type - if has projects and not already a customer, show as customer
    const effectiveType = role === 'customer' ? 'customer' : 
                         (hasProjects ? "customer" : role || "lead");

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
    <>
      {selectedUsers.length > 0 && (
        <CRMSelectionBar
          selectedCount={selectAllPages ? totalUsers : selectedUsers.length}
          totalCount={totalUsers}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDeleteClick={() => setShowDeleteDialog(true)}
          usersInPage={users.length}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length || selectAllPages}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id) || selectAllPages}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
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
                    onClick={() => setSelectedUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserProfileEditModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          onUserUpdated={onUserUpdated}
        />
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        selectAllPages={selectAllPages}
      />
    </>
  );
};
