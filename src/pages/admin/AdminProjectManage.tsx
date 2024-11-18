import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import StagesTimeline from "@/components/StagesTimeline";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProducts } from "@/components/admin/projects/manage/ClientProducts";
import { ClientSamples } from "@/components/admin/projects/manage/ClientSamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { PACK_LABELS } from "@/types/project";
import { useToast } from "@/components/ui/use-toast";

const AdminProjectManage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  
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

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-covers')
        .getPublicUrl(filePath);

      await supabase
        .from('projects')
        .update({ cover_image_url: publicUrl })
        .eq('id', id);

      toast({
        title: "Success",
        description: "Project cover updated successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload cover image",
      });
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/projects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gray-100">
          {project.cover_image_url ? (
            <img 
              src={project.cover_image_url} 
              alt="Project cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-muted-foreground">No cover image</p>
            </div>
          )}
          <div className="absolute bottom-4 right-4">
            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={handleCoverUpload}
            />
            <label htmlFor="cover-upload">
              <Button variant="secondary" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Upload Cover
                </span>
              </Button>
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500">
              {project.status === 'em_andamento' ? 'Active' : 'Completed'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h3 className="font-medium">Client Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Client Name</p>
                  <p className="font-medium">
                    {`${project.user?.first_name || ''} ${project.user?.last_name || ''}`.trim() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{project.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{project.user?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {[
                      project.user?.shipping_address_street,
                      project.user?.shipping_address_city,
                      project.user?.shipping_address_state,
                      project.user?.shipping_address_zip
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Project Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Project ID</p>
                  <p className="font-medium">{project.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pack Type</p>
                  <p className="font-medium">{PACK_LABELS[project.pack_type]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Project Started</p>
                  <p className="font-medium">{format(new Date(project.created_at), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{format(new Date(project.user?.created_at), 'PPP')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

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