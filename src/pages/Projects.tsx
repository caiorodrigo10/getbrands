
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; 
import { supabaseAdmin } from "@/lib/supabase/admin";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissions } from "@/lib/permissions";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { toast } from "sonner";

const Projects = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserPermissions();
  
  console.log("Projects page - User:", { 
    userId: user?.id,
    userEmail: user?.email,
    isAdmin
  });
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects", user?.id, isAdmin],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      
      try {
        console.log("Fetching projects with permissions:", { isAdmin, userId: user.id });
        
        // If admin, fetch all projects, otherwise fetch only user's projects
        const query = isAdmin ? 
          supabaseAdmin.from("projects").select(`
            *,
            project_products (
              id
            )
          `) :
          supabase.from("projects").select(`
            *,
            project_products (
              id
            )
          `).eq("user_id", user.id);
        
        const { data: projectsData, error: projectsError } = await query;

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }
        
        console.log("Projects fetched:", projectsData?.length || 0);
        return projectsData;
      } catch (err) {
        console.error("Unexpected error in projects query:", err);
        throw err;
      }
    },
    enabled: !!user?.id,
    retry: 2,
    retryDelay: 1000,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects. Please try again.");
      }
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error in Projects component:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <div className="text-red-500 p-4 border rounded-md">
          Failed to load projects. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        My Projects
      </h1>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <ProjectProgressCard key={project.id} project={project} />
        ))}
        {(!projects || projects.length === 0) && (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
