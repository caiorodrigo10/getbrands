import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Address } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";

interface SavedAddressSelectProps {
  userId: string;
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
  onAddNew: () => void;
}

export const SavedAddressSelect = ({
  userId,
  selectedAddressId,
  onAddressSelect,
}: SavedAddressSelectProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: addresses } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .eq("used_in_order", true)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId,
  });

  const handleDelete = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .match({ id: addressId, user_id: userId });

      if (error) throw error;

      queryClient.setQueryData(["addresses", userId], (oldData: Address[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(address => address.id !== addressId);
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete address. Please try again.",
      });
    }
  };

  if (!addresses?.length) {
    return null;
  }

  return (
    <RadioGroup
      value={selectedAddressId || undefined}
      onValueChange={onAddressSelect}
      className="space-y-3"
    >
      {addresses.map((address) => (
        <div key={address.id} className="flex items-start space-x-3 rounded-lg border p-4">
          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
          <Label htmlFor={address.id} className="flex-1 cursor-pointer space-y-1">
            <div className="font-medium">
              {address.first_name} {address.last_name}
            </div>
            <div className="text-sm text-muted-foreground">
              {address.street_address1}
              {address.street_address2 && `, ${address.street_address2}`}
            </div>
            <div className="text-sm text-muted-foreground">
              {address.city}, {address.state} {address.zip_code}
            </div>
            {address.phone && (
              <div className="text-sm text-muted-foreground">
                {address.phone}
              </div>
            )}
          </Label>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(address.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </RadioGroup>
  );
};