import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { CRMTable } from "@/components/admin/crm/CRMTable";
import { Database } from "@/integrations/supabase/types";

type Project = {
  id: string;
  name: string;
  status: string | null;
  pack_type: Database["public"]["Enums"]["project_pack_type"];
};

const AdminCRM = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["crm-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          avatar_url,
          user_type,
          created_at,
          projects:projects(
            id,
            name,
            status,
            pack_type
          )
        `);

      if (error) throw error;
      
      return data.map((user) => ({
        ...user,
        projects: user.projects as Project[] | null
      }));
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

      <CRMTable users={filteredUsers || []} onUserUpdated={refetch} />
    </div>
  );
};

export default AdminCRM;