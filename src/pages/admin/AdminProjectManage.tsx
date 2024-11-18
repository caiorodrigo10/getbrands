import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StagesTimeline from "@/components/StagesTimeline";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientProducts } from "@/components/admin/projects/manage/ClientProducts";
import { ClientSamples } from "@/components/admin/projects/manage/ClientSamples";

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
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            shipping_address_street,
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
        <Badge className="bg-emerald-500/10 text-emerald-500">
          {project.status === 'em_andamento' ? 'Active' : 'Completed'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">
                {`${project.profiles?.first_name || ''} ${project.profiles?.last_name || ''}`.trim()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{project.profiles?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{project.profiles?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {[
                  project.profiles?.shipping_address_street,
                  project.profiles?.shipping_address_city,
                  project.profiles?.shipping_address_state,
                  project.profiles?.shipping_address_zip
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Completion</p>
              <p className="font-medium">
                {new Date(new Date(project.created_at).setMonth(
                  new Date(project.created_at).getMonth() + 3
                )).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="font-medium">{project.points} points</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Client Products */}
      <ClientProducts projectId={project.id} />

      {/* Client Samples */}
      <ClientSamples userId={project.profiles?.id} />

      {/* Project Progress */}
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
    </div>
  );
};

export default AdminProjectManage;