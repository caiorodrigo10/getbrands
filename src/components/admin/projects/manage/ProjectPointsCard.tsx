import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PACK_LABELS } from "@/types/project";
import { Progress } from "@/components/ui/progress";

interface ProjectPointsCardProps {
  project: {
    id: string;
    points: number;
    points_used: number;
    pack_type: 'start' | 'pro' | 'ultra';
    user?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      shipping_address_street?: string;
      shipping_address_street2?: string;
      shipping_address_city?: string;
      shipping_address_state?: string;
      shipping_address_zip?: string;
    };
  };
}

export const ProjectPointsCard = ({ project }: ProjectPointsCardProps) => {
  const [showClientInfo, setShowClientInfo] = useState(true);
  const [showProjectPoints, setShowProjectPoints] = useState(true);
  const queryClient = useQueryClient();

  const handlePointsChange = async (amount: number) => {
    const newPoints = (project.points || 0) + amount;
    
    if (newPoints < 0) {
      toast.error("Points cannot be negative");
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ points: newPoints })
        .eq('id', project.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-project", project.id] });
      toast.success(`Points ${amount > 0 ? 'added' : 'removed'} successfully`);
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error("Failed to update points");
    }
  };

  const availablePoints = project.points - (project.points_used || 0);
  const progressPercentage = ((project.points_used || 0) / project.points) * 100;

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Client Information Section */}
        <div className="md:border-r border-border/30 pr-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClientInfo(!showClientInfo)}
              className="flex items-center gap-2"
            >
              {showClientInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showClientInfo && (
            <div className="space-y-3">
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
        </div>

        {/* Project Points Section */}
        <div className="pl-0 md:pl-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Project Points</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProjectPoints(!showProjectPoints)}
              className="flex items-center gap-2"
            >
              {showProjectPoints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {showProjectPoints && (
            <div className="w-full">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total Points:</span>
                  <span className="font-medium text-foreground">{project.points}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Points Used:</span>
                  <span className="font-medium text-foreground">{project.points_used || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available Points:</span>
                  <span className="font-medium text-primary">{availablePoints}</span>
                </div>
                <Progress value={progressPercentage} className="h-2 mt-2" />
              </div>
              <div className="mt-4">
                <Badge className="bg-purple-500/10 text-purple-500">
                  {PACK_LABELS[project.pack_type]}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePointsChange(-1000)}
                  disabled={!project.points || project.points < 1000}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePointsChange(1000)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};