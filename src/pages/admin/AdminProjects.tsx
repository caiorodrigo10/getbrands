import { useState } from "react";
import { Input } from "@/components/ui/input";
import AdminProjectsTable from "@/components/admin/projects/AdminProjectsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectWithDetails extends Project {
  profiles?: Profile | null;
}

const AdminProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map((project: ProjectWithDetails) => ({
        id: project.id,
        name: project.name,
        client: `${project.profiles?.first_name || ''} ${project.profiles?.last_name || ''}`.trim(),
        email: project.profiles?.email || '',
        phone: project.profiles?.phone || '',
        status: project.status === 'em_andamento' ? 'Active' : 'Completed',
        progress: 65,
        accountManager: "Sarah Johnson",
        points: project.points || 0,
        lastUpdate: "Product selection phase completed",
        updatedAt: project.updated_at
      })) || [];
    }
  });

  const filteredProjects = (projects || []).filter(project => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.client.toLowerCase().includes(searchLower) ||
      project.accountManager.toLowerCase().includes(searchLower)
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
        <h1 className="text-2xl font-semibold">Projects Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all ongoing projects
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search projects..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AdminProjectsTable projects={filteredProjects} />
    </div>
  );
};

export default AdminProjects;