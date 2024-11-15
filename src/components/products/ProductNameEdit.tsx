import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductNameEditProps {
  projectProductId: string;
  currentName: string;
  onNameUpdate: (newName: string) => void;
}

export const ProductNameEdit = ({ projectProductId, currentName, onNameUpdate }: ProductNameEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('project_specific_products')
        .upsert({
          project_product_id: projectProductId,
          name: name,
        })
        .select()
        .single();

      if (error) throw error;

      onNameUpdate(name);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Product name updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product name",
        variant: "destructive",
      });
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{currentName}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="h-8 w-8 p-0 text-green-600"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(false)}
        className="h-8 w-8 p-0 text-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};