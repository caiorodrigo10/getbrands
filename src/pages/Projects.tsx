
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { useUserPermissions } from "@/lib/permissions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Projects = () => {
  const { user } = useAuth();
  const { hasFullAccess, isAdmin, profile } = useUserPermissions();
  const navigate = useNavigate();
  // Explicitly check for admin status
  const canAccessProjects = hasFullAccess || isAdmin === true;
  
  useEffect(() => {
    console.log("Projects - Permission check:", { 
      hasFullAccess, 
      isAdmin, 
      canAccessProjects,
      profileRole: profile?.role,
      userId: user?.id
    });
    
    if (!canAccessProjects) {
      console.log("Redirecting: user doesn't have permission to access Projects");
      navigate('/catalog');
    }
  }, [hasFullAccess, isAdmin, navigate, canAccessProjects, profile, user]);
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select(`
            *,
            project_products (
              id
            )
          `)
          .eq('user_id', user.id)
          .order("created_at", { ascending: false });

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }
        
        console.log("Projects fetched:", projectsData);
        return projectsData;
      } catch (err) {
        console.error("Unexpected error in projects query:", err);
        toast.error("Failed to load projects. Please try again.");
        throw err;
      }
    },
    enabled: !!user?.id && canAccessProjects,
  });

  if (!canAccessProjects) {
    return null;
  }

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
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <div className="text-red-500">
          Failed to load projects. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Projects</h1>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <ProjectProgressCard key={project.id} project={project} />
        ))}
        {(!projects || projects.length === 0) && (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">You don't have any projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
