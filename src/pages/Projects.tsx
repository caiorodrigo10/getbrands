
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProgressCard } from "@/components/projects/ProjectProgressCard";
import { useUserPermissions } from "@/lib/permissions";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const { user } = useAuth();
  const { hasFullAccess, isAdmin } = useUserPermissions();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Projects - Verificando permissões:", { hasFullAccess, isAdmin });
    
    if (!hasFullAccess) {
      console.log("Redirecionando: usuário sem permissão para acessar Projects");
      navigate('/catalog');
    }
  }, [hasFullAccess, isAdmin, navigate]);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          project_products (
            id
          )
        `)
        .eq('user_id', user?.id)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;
      return projectsData;
    },
    enabled: !!user?.id && hasFullAccess,
  });

  if (!hasFullAccess) {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Projetos</h1>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <ProjectProgressCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
