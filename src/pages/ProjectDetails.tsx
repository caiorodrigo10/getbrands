
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { ProjectStage } from "@/components/project/ProjectStage";
import { CalendarStage } from "@/components/project/CalendarStage";
import { ProductSelectionStage } from "@/components/project/ProductSelectionStage";
import { PackageDesignStage } from "@/components/project/PackageDesignStage";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissions } from "@/lib/permissions";
import { toast } from "sonner";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useUserPermissions();

  console.log("ProjectDetails - User info:", { 
    userId: user?.id,
    projectId: id,
    isAdmin
  });

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id, isAdmin],
    queryFn: async () => {
      if (!id || !user?.id) {
        throw new Error("User ID and Project ID are required");
      }
      
      console.log("Fetching project details for id:", id);
      
      // Choose client based on admin status
      const client = isAdmin ? supabaseAdmin : supabase;
      
      const { data: projectData, error } = await client
        .from("projects")
        .select(`
          *,
          project_products (
            id,
            product: products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching project details:", error);
        throw error;
      }
      
      return projectData;
    },
    enabled: !!id && !!user?.id,
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
        navigate("/projects");
      }
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Project Not Found</h1>
          <Button variant="outline" onClick={() => navigate("/projects")}>
            Back
          </Button>
        </div>
        <div className="text-red-500 p-4 border rounded-md">
          Unable to load project details.
        </div>
      </div>
    );
  }

  const totalPoints = project?.points || 1000;
  const usedPoints = project?.points_used || 0;
  const remainingPoints = totalPoints - usedPoints;
  const progressPercentage = (usedPoints / totalPoints) * 100;

  const stages = [
    {
      title: "Onboarding",
      description: "Schedule a call with our team to start your project",
      status: "pending" as const,
      content: <CalendarStage />,
    },
    {
      title: "Product Selection",
      description: "Choose products for your project",
      status: "pending" as const,
      content: (
        <ProductSelectionStage
          projectProducts={project?.project_products}
          totalPoints={totalPoints}
          usedPoints={usedPoints}
          remainingPoints={remainingPoints}
          progressPercentage={progressPercentage}
        />
      ),
    },
    {
      title: "Naming",
      description: "Brand name development",
      status: "pending" as const,
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">In development by our team.</p>
        </div>
      ),
    },
    {
      title: "Visual Identity",
      description: "Creation of your brand's visual identity",
      status: "completed" as const,
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Visual identity has been completed.</p>
        </div>
      ),
    },
    {
      title: "Package Design",
      description: "Design of your product packages",
      status: "pending" as const,
      content: <PackageDesignStage />,
      type: "package-quiz" as const,
    },
    {
      title: "E-commerce",
      description: "Implementation of your online store",
      status: "pending" as const,
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Waiting for previous stage completion.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <Button variant="outline" onClick={() => navigate("/projects")}>
          Back
        </Button>
      </div>

      <div className="grid gap-4">
        {stages.map((stage) => (
          <ProjectStage
            key={stage.title}
            title={stage.title}
            description={stage.description}
            status={stage.status}
            type={stage.type}
          >
            {stage.content}
          </ProjectStage>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
