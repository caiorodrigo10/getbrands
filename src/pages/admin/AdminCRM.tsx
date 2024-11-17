import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { CRMTable } from "@/components/admin/crm/CRMTable";

const AdminCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["crm-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_view")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const filteredUsers = users?.filter((user) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (user.email?.toLowerCase().includes(searchLower)) ||
      (user.phone?.toLowerCase().includes(searchLower))
    );
  });

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
        <h1 className="text-2xl font-semibold">Customer Relationship Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all users and their projects
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search users..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CRMTable users={filteredUsers || []} />
    </div>
  );
};

export default AdminCRM;