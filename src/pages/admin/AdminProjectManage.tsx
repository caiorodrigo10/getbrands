import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StagesTimeline from "@/components/StagesTimeline";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectWithProfile extends Project {
  profiles: Profile | null;
}

interface FormattedProject {
  id: string;
  name: string;
  description: string | null;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  status: string;
  progress: number;
  accountManager: string;
  points: number | null;
  lastUpdate: string;
  startDate: string;
  expectedCompletion: string;
}

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
      
      const projectData = data as unknown as ProjectWithProfile;
      
      const formattedProject: FormattedProject = {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        client: {
          name: `${projectData.profiles?.first_name || ''} ${projectData.profiles?.last_name || ''}`.trim(),
          email: projectData.profiles?.email || '',
          phone: projectData.profiles?.phone || '',
          address: [
            projectData.profiles?.shipping_address_street,
            projectData.profiles?.shipping_address_city,
            projectData.profiles?.shipping_address_state,
            projectData.profiles?.shipping_address_zip
          ].filter(Boolean).join(', ')
        },
        status: projectData.status === 'em_andamento' ? 'Active' : 'Completed',
        progress: 35,
        accountManager: "Michael Anderson",
        points: projectData.points,
        lastUpdate: "Naming phase in progress",
        startDate: new Date(projectData.created_at).toLocaleDateString('en-US'),
        expectedCompletion: new Date(new Date(projectData.created_at).setMonth(new Date(projectData.created_at).getMonth() + 3)).toLocaleDateString('en-US')
      };

      return formattedProject;
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
          {project.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{project.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{project.client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{project.client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{project.client.address}</p>
            </div>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Account Manager</p>
              <p className="font-medium">{project.accountManager}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Completion</p>
              <p className="font-medium">{project.expectedCompletion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="font-medium">{project.points} points</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-full bg-muted/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[40px]">
            {project.progress}%
          </span>
        </div>
        <Separator className="my-6" />
        <StagesTimeline />
      </Card>
    </div>
  );
};

export default AdminProjectManage;