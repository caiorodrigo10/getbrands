import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Package, User, Image as ImageIcon } from "lucide-react";
import { PACK_LABELS } from "@/types/project-types";
import { ProjectCoverUpload } from "./ProjectCoverUpload";
import { ProjectEditModal } from "./ProjectEditModal";

interface ProjectHeaderProps {
  project: any;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <ProjectEditModal project={project} onUpdate={() => window.location.reload()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Client Details</p>
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
              <p className="text-sm text-muted-foreground">Shipping Address</p>
              <p className="font-medium mt-1">
                {[
                  project.user?.shipping_address_street,
                  project.user?.shipping_address_city,
                  project.user?.shipping_address_state,
                  project.user?.shipping_address_zip
                ].filter(Boolean).join(', ') || 'No address'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
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
  );
};