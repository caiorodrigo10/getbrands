import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PACK_LABELS } from "@/types/project";

interface ProjectInfoProps {
  project: any;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  );
};