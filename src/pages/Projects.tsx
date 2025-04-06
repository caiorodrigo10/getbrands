
import { useQuery } from "@tanstack/react-query";
import { supabaseAdmin } from "@/lib/supabase/admin"; 
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { useUserPermissions } from "@/lib/permissions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Projects = () => {
  const { user } = useAuth();
  const { hasFullAccess, isAdmin } = useUserPermissions();
  const navigate = useNavigate();
  
  // Explicitly check for admin status or full access
  const canAccessProjects = hasFullAccess || isAdmin;
  
  // Debug logs
  console.log("Projects page - User permissions:", { 
    userId: user?.id,
    userEmail: user?.email,
    hasFullAccess, 
    isAdmin, 
    canAccessProjects
  });
  
  useEffect(() => {
    // Only redirect if not an admin and we're sure about permissions
    if (user && !canAccessProjects) {
      console.log("Redirecting: user doesn't have permission to access Projects");
      toast.error("You don't have permission to access projects");
      navigate('/catalog');
    }
  }, [hasFullAccess, isAdmin, navigate, canAccessProjects, user]);
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects", user?.id, isAdmin],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      
      try {
        console.log("Fetching projects for user:", user.id, "isAdmin:", isAdmin);
        
        // Always use supabaseAdmin to avoid permission issues
        const { data: projectsData, error: projectsError } = await supabaseAdmin
          .from("projects")
          .select(`
            *,
            project_products (
              id
            )
          `)
          .eq('user_id', user.id);

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }
        
        console.log("Projects fetched:", projectsData?.length || 0);
        return projectsData;
      } catch (err) {
        console.error("Unexpected error in projects query:", err);
        toast.error("Failed to load projects. Please try again.");
        throw err;
      }
    },
    enabled: !!user?.id && canAccessProjects,
    retry: 2,
    retryDelay: 1000,
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
        {isAdmin ? "All Projects" : "My Projects"}
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
