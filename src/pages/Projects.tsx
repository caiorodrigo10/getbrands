
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; 
import { supabaseAdmin } from "@/lib/supabase/admin";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissions } from "@/lib/permissions";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { toast } from "sonner";
import { useEffect } from "react";

const Projects = () => {
  const { user } = useAuth();
  const { isAdmin, profile } = useUserPermissions();
  
  // Enhanced logging for debugging
  useEffect(() => {
    console.log("Projects page - Detailed auth info:", { 
      userId: user?.id,
      userEmail: user?.email,
      isAdmin,
      profileRole: profile?.role,
      userMetadataRole: user?.user_metadata?.role,
    });
    
    // Debug supabaseAdmin client
    console.log("Projects page - Checking Supabase clients:", {
      regularClientExists: !!supabase,
      adminClientExists: !!supabaseAdmin,
      adminServiceRoleKey: supabaseAdmin?.auth?.admin ? "initialized" : "not initialized"
    });
  }, [user, isAdmin, profile]);
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects", user?.id, isAdmin],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      
      try {
        console.log("Fetching projects with permissions:", { 
          isAdmin, 
          userId: user.id,
          profileRole: profile?.role
        });
        
        // Check if we're in an admin route specifically
        const isAdminRoute = window.location.pathname.includes("/admin");
        console.log("Current route info:", { 
          path: window.location.pathname,
          isAdminRoute,
          usingAdminClient: isAdmin || isAdminRoute
        });
        
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
        
        console.log("About to execute query with client:", isAdmin ? "supabaseAdmin" : "supabase");
        
        const { data: projectsData, error: projectsError } = await query;

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }
        
        // Detailed logging of returned data
        console.log("Projects fetched successfully:", {
          count: projectsData?.length || 0,
          firstProjectId: projectsData?.[0]?.id,
          isAdminFetchingAll: isAdmin
        });
        
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

  // Additional debugging for the rendered state
  useEffect(() => {
    if (projects) {
      console.log("Projects ready for rendering:", {
        count: projects.length,
        projectIds: projects.map(p => p.id).join(', ')
      });
    }
  }, [projects]);

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
