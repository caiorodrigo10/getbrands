import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminBulkActions = () => {
  const { data: actions, isLoading } = useQuery({
    queryKey: ["bulk-actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bulk_actions")
        .select(`
          *,
          created_by:profiles(
            first_name,
            last_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500",
      processing: "bg-blue-500/10 text-blue-500",
      completed: "bg-green-500/10 text-green-500",
      failed: "bg-red-500/10 text-red-500",
    };

    return variants[status] || "bg-gray-500/10 text-gray-500";
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
          View the history of all bulk operations performed on the platform
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action Type</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Affected Records</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actions?.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="capitalize">{action.action_type}</TableCell>
                <TableCell className="capitalize">{action.entity_type}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(action.status)}>
                    {action.status}
                  </Badge>
                </TableCell>
                <TableCell>{action.affected_records || "-"}</TableCell>
                <TableCell>
                  {action.created_by?.first_name
                    ? `${action.created_by.first_name} ${action.created_by.last_name}`
                    : action.created_by?.email}
                </TableCell>
                <TableCell>
                  {format(new Date(action.created_at), "MMM d, yyyy HH:mm")}
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