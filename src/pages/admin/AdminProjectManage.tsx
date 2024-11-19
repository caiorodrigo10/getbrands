import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import StagesTimeline from "@/components/StagesTimeline";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProducts } from "@/components/admin/projects/manage/ClientProducts";
import { ClientSamples } from "@/components/admin/projects/manage/ClientSamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PACK_LABELS } from "@/types/project";

const AdminProjectManage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showClientInfo, setShowClientInfo] = useState(false);
  
  const { data: project, isLoading } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      if (!id) return null;
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

  const handleAddPoints = async () => {
    if (!id) return;
    const { error } = await supabase
      .from('projects')
      .update({ points: (project?.points || 0) + 100 })
      .eq('id', id);
    
    if (error) throw error;
  };

  const handleReducePoints = async () => {
    if (!id || !project?.points || project.points < 100) return;
    const { error } = await supabase
      .from('projects')
      .update({ points: project.points - 100 })
      .eq('id', id);
    
    if (error) throw error;
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
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
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-500">
              {project.status === 'em_andamento' ? 'Active' : 'Completed'}
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-500">
              {PACK_LABELS[project.pack_type]}
            </Badge>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Project Points</h3>
              <p className="text-3xl font-bold mt-1">{project.points}</p>
              <p className="text-sm text-muted-foreground">
                {project.points_used || 0} points used
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReducePoints}
                disabled={!project.points || project.points < 100}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPoints}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowClientInfo(!showClientInfo)}
            className="w-full flex items-center justify-between"
          >
            <span>Client Information</span>
            {showClientInfo ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showClientInfo && (
            <div className="mt-4 space-y-3">
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
          )}
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
    </div>
  );
};

export default AdminProjectManage;