
import { useState } from "react";
import { Input } from "@/components/ui/input";
import AdminProjectsTable from "@/components/admin/projects/AdminProjectsTable";
import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/integrations/supabase/types";
import { ProjectPackType } from "@/types/project";
import { useUserPermissions } from "@/lib/permissions";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectWithProfile extends Project {
  profiles: Profile | null;
  pack_type: ProjectPackType;
}

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
  pack_type: ProjectPackType;
}

const AdminProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useUserPermissions();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects", isAdmin],
    queryFn: async () => {
      if (!isAdmin) {
        console.error("Unauthorized access to admin projects");
        return [];
      }

      console.log("Fetching admin projects data");
      
      try {
        const { data, error } = await supabaseAdmin
          .from("projects")
          .select(`
            *,
            profiles:user_id (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching admin projects:", error);
          throw error;
        }
        
        console.log("Admin projects fetched successfully:", { count: data?.length });
        
        const formattedProjects: FormattedProject[] = (data as unknown as ProjectWithProfile[]).map(project => ({
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
          updatedAt: project.updated_at,
          pack_type: project.pack_type || 'start'
        }));

        return formattedProjects;
      } catch (err) {
        console.error("Unexpected error in admin projects query:", err);
        return [];
      }
    },
    enabled: !!isAdmin
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

      {projects && projects.length > 0 ? (
        <AdminProjectsTable projects={filteredProjects} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
