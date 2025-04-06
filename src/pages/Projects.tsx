
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; 
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
  
  // Verificação explícita para status de administrador ou acesso total
  const canAccessProjects = hasFullAccess || isAdmin;
  
  // Logs de depuração
  console.log("Projects page - User permissions:", { 
    userId: user?.id,
    userEmail: user?.email,
    hasFullAccess, 
    isAdmin, 
    canAccessProjects
  });
  
  useEffect(() => {
    // Apenas redirecionar se não for admin e tivermos certeza sobre as permissões
    if (user && !canAccessProjects) {
      console.log("Redirecionando: usuário não tem permissão para acessar Projects");
      toast.error("Você não tem permissão para acessar projetos");
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
        
        // Vamos utilizar o cliente correto baseado na permissão do usuário
        const client = isAdmin ? supabaseAdmin : supabase;
        
        const { data: projectsData, error: projectsError } = await client
          .from("projects")
          .select(`
            *,
            project_products (
              id
            )
          `);

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }
        
        console.log("Projects fetched:", projectsData?.length || 0);
        return projectsData;
      } catch (err) {
        console.error("Unexpected error in projects query:", err);
        toast.error("Falha ao carregar projetos. Por favor, tente novamente.");
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
