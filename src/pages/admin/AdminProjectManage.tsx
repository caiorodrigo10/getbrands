import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProducts } from "@/components/admin/projects/manage/ClientProducts";
import { ClientSamples } from "@/components/admin/projects/manage/ClientSamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "@/components/admin/projects/manage/ProjectHeader";
import { ProjectCoverUpload } from "@/components/admin/projects/manage/ProjectCoverUpload";
import { ProjectInfo } from "@/components/admin/projects/manage/ProjectInfo";
import StagesTimeline from "@/components/StagesTimeline";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const AdminProjectManage = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          user:profiles (
            id,
            first_name,
            last_name,
            email,
            phone,
            created_at,
            shipping_address_street,
            shipping_address_street2,
            shipping_address_city,
            shipping_address_state,
            shipping_address_zip
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
              <Badge className="mt-2 bg-emerald-500/10 text-emerald-500">
                {project.status === 'em_andamento' ? 'Active' : 'Completed'}
              </Badge>
            </div>
            <div className="w-64 ml-6">
              <ProjectCoverUpload 
                projectId={project.id}
                coverUrl={project.cover_image_url}
                onUploadSuccess={refetch}
              />
            </div>
          </div>

          <CollapsibleContent className="space-y-4">
            <ProjectInfo project={project} />
          </CollapsibleContent>

          <CollapsibleTrigger className="w-full pt-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Show More</span>
                </>
              )}
            </div>
          </CollapsibleTrigger>
        </Card>
      </Collapsible>

      <Tabs defaultValue="project-stages" className="w-full">
        <TabsList className="bg-white border-b w-full justify-start rounded-none h-12 p-0">
          <TabsTrigger 
            value="project-stages"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
          >
            Project Stages
          </TabsTrigger>
          <TabsTrigger 
            value="selected-products"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
          >
            Selected Products
          </TabsTrigger>
          <TabsTrigger 
            value="sample-requests"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-4"
          >
            Sample Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project-stages" className="mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-2 w-full bg-muted/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                  style={{ width: '35%' }}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[40px]">
                35%
              </span>
            </div>
            <Separator className="my-6" />
            <StagesTimeline />
          </Card>
        </TabsContent>

        <TabsContent value="selected-products" className="mt-6">
          <ClientProducts projectId={project.id} />
        </TabsContent>

        <TabsContent value="sample-requests" className="mt-6">
          <ClientSamples userId={project.user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProjectManage;