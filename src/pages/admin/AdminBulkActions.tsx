import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BulkAction } from "@/types/bulk-actions";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

const AdminBulkActions = () => {
  const { data: actions, isLoading } = useQuery({
    queryKey: ["bulk-actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_actions")
        .select(`
          *,
          created_by_profile:profiles!bulk_actions_created_by_fkey (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (BulkAction & { created_by_profile: Profile })[];
    },
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      failed: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    }[status] || "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";

    return <Badge className={styles}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Bulk Actions</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all bulk operations
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action Type</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Affected Records</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions?.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium">
                  {action.action_type}
                </TableCell>
                <TableCell>{action.entity_type}</TableCell>
                <TableCell>{getStatusBadge(action.status)}</TableCell>
                <TableCell>
                  {action.created_by_profile ? (
                    <div>
                      <p className="font-medium">
                        {[
                          action.created_by_profile.first_name,
                          action.created_by_profile.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {action.created_by_profile.email}
                      </p>
                    </div>
                  ) : (
                    "System"
                  )}
                </TableCell>
                <TableCell>{action.affected_records || 0}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(action.created_at), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminBulkActions;