import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCoverUploadProps {
  projectId: string;
  coverUrl?: string | null;
  onUploadSuccess: () => void;
}

export const ProjectCoverUpload = ({ projectId, coverUrl, onUploadSuccess }: ProjectCoverUploadProps) => {
  const { toast } = useToast();

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${projectId}/${crypto.randomUUID()}.${fileExt}`;

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
        .eq('id', projectId);

      toast({
        title: "Success",
        description: "Project cover updated successfully",
      });

      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload cover image",
      });
    }
  };

  return (
    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
      {coverUrl ? (
        <img 
          src={coverUrl} 
          alt="Project cover" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-muted-foreground">No cover image</p>
        </div>
      )}
      <div className="absolute bottom-2 right-2">
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
  );
};