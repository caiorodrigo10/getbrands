import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Search, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}

interface MediaLibraryItem {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  category?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export function MediaLibrary({ open, onOpenChange, onSelect, multiple = true }: MediaLibraryProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: images = [], refetch } = useQuery({
    queryKey: ['media-library', search],
    queryFn: async () => {
      const query = supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (search) {
        query.ilike('file_name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaLibraryItem[];
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      try {
        for (const file of acceptedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `library/${fileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          // Save to media library
          const { error: dbError } = await supabase
            .from('media_library')
            .insert({
              file_name: file.name,
              file_url: publicUrl,
              file_size: file.size,
              mime_type: file.type,
            });

          if (dbError) throw dbError;
        }

        refetch();
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading images:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload images",
        });
      } finally {
        setIsUploading(false);
      }
    }
  });

  const handleImageClick = (url: string) => {
    if (multiple) {
      setSelectedImages(prev => 
        prev.includes(url) 
          ? prev.filter(i => i !== url)
          : [...prev, url]
      );
    } else {
      setSelectedImages([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedImages);
    onOpenChange(false);
    setSelectedImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            disabled={selectedImages.length === 0}
            onClick={handleConfirm}
          >
            Select {selectedImages.length > 0 && `(${selectedImages.length})`}
          </Button>
        </div>

        <div 
          {...getRootProps()} 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p className="text-muted-foreground">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-primary">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Drag & drop images here, or click to select files
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative aspect-square cursor-pointer group border rounded-lg overflow-hidden",
                  selectedImages.includes(image.file_url) && "ring-2 ring-primary"
                )}
                onClick={() => handleImageClick(image.file_url)}
              >
                <img
                  src={image.file_url}
                  alt={image.file_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}