import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCoverUploadProps {
  projectId: string;
}

export const ProjectCoverUpload = ({ projectId }: ProjectCoverUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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

      const { error: updateError } = await supabase
        .from('projects')
        .update({ cover_image_url: publicUrl })
        .eq('id', projectId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Project cover uploaded successfully",
      });

      // Reload the page to show the new cover
      window.location.reload();
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload project cover",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <input
        type="file"
        id="cover-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <Button
        variant="ghost"
        disabled={isUploading}
        onClick={() => document.getElementById('cover-upload')?.click()}
      >
        {isUploading ? "Uploading..." : "Upload Cover Image"}
      </Button>
    </div>
  );
};