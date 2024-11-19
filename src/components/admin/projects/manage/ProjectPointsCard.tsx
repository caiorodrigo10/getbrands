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
  const [showClientInfo, setShowClientInfo] = useState(false);
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Project Points</h3>
          <div className="mt-4 space-y-2">
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
        </div>
        <div className="flex items-center gap-2">
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
  );
};