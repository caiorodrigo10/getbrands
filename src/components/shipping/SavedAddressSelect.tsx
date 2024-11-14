import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Address } from "@/types/shipping";

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
  onAddNew,
}: SavedAddressSelectProps) => {
  const { data: addresses } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId,
  });

  if (!addresses?.length) {
    return (
      <Button onClick={onAddNew} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Address
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedAddressId || undefined}
        onValueChange={onAddressSelect}
        className="space-y-2"
      >
        {addresses.map((address) => (
          <div key={address.id} className="flex items-center space-x-3 rounded-lg border p-4">
            <RadioGroupItem value={address.id} id={address.id} />
            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
              <div>
                <p className="font-medium">{address.name || 'Shipping Address'}</p>
                <p className="text-sm text-muted-foreground">
                  {address.street_address1}
                  {address.street_address2 && `, ${address.street_address2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.zip_code}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Button onClick={onAddNew} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Address
      </Button>
    </div>
  );
};