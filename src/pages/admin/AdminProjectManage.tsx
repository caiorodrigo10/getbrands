import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Package, User, Image as ImageIcon } from "lucide-react";
import StagesTimeline from "@/components/StagesTimeline";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProducts } from "@/components/admin/projects/manage/ClientProducts";
import { ClientSamples } from "@/components/admin/projects/manage/ClientSamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { PACK_LABELS } from "@/types/project";
import { ProjectCoverUpload } from "@/components/admin/projects/manage/ProjectCoverUpload";

const AdminProjectManage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: project, isLoading } = useQuery({
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
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin/projects')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <Badge className="bg-emerald-500/10 text-emerald-500">
            {project.status === 'em_andamento' ? 'Active' : 'Completed'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {`${project.user?.first_name || ''} ${project.user?.last_name || ''}`.trim() || 'N/A'}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{project.user?.email}</p>
                <p className="text-sm text-muted-foreground">{project.user?.phone || 'No phone'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium mt-1">
                  {[
                    project.user?.shipping_address_street,
                    project.user?.shipping_address_city,
                    project.user?.shipping_address_state,
                    project.user?.shipping_address_zip
                  ].filter(Boolean).join(', ') || 'No address'}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Project Details</p>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{PACK_LABELS[project.pack_type]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">Started {format(new Date(project.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium mt-1">
                  {format(new Date(project.user?.created_at || project.created_at), "MMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Project ID</p>
                <p className="font-medium">{project.id}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt="Project cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <ProjectCoverUpload projectId={project.id} />
              </div>
            )}
          </div>
        </div>
      </div>

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