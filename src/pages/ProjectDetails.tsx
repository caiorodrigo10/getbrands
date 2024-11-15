import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarIcon, Plus, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { ProjectStage } from "@/components/project/ProjectStage";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#4c1e6c" } },
      });
    })();
  }, []);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data: projectData, error } = await supabase
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

      if (error) throw error;
      return projectData;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">Schedule a call with our team:</p>
          <Cal
            calLink="team/your-team"
            style={{ width: "100%", height: "100%", minHeight: "500px" }}
            config={{
              layout: "month_view",
              hideEventTypeDetails: false,
              apiKey: "cal_live_64f1358eb9a10e9ec0e6795507e83554",
            }}
          />
        </div>
      ),
    },
    {
      title: "Product Selection",
      description: "Choose products for your project",
      status: "pending" as const,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {project?.project_products?.length || 0} products selected
            </p>
            <Button onClick={() => navigate("/catalog")} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Products
            </Button>
          </div>

          <Card className="p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Project Points</span>
                <span className="text-sm font-medium">{remainingPoints} points remaining</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{usedPoints} used</span>
                <span>{totalPoints} total</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project?.project_products?.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.product.image_url || "/placeholder.svg"} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Product</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
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
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">Waiting for previous stage completion.</p>
        </div>
      ),
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
          >
            {stage.content}
          </ProjectStage>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;