import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavedAddressSelect } from "@/components/shipping/SavedAddressSelect";
import { Address } from "@/types/shipping";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";

interface AddressSelectionSectionProps {
  user: { id: string };
  addresses: Address[] | undefined;
  selectedAddressId: string | null;
  form: UseFormReturn<ShippingFormData>;
  setSelectedAddressId: (id: string | null) => void;
}

export const AddressSelectionSection = ({
  user,
  addresses,
  selectedAddressId,
  form,
  setSelectedAddressId,
}: AddressSelectionSectionProps) => {
  const [showAddressSelect, setShowAddressSelect] = useState(false);

  if (!addresses?.length || addresses.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddressSelect(!showAddressSelect)}
          className="w-auto"
        >
          {showAddressSelect ? "Hide Saved Addresses" : "Select Another Address"}
        </Button>
      </div>
      
      {showAddressSelect && (
        <SavedAddressSelect
          userId={user.id}
          selectedAddressId={selectedAddressId}
          onAddressSelect={(addressId) => {
            const selectedAddress = addresses.find(addr => addr.id === addressId);
            if (selectedAddress) {
              form.reset({
                ...form.getValues(),
                address1: selectedAddress.street_address1,
                address2: selectedAddress.street_address2 || "",
                city: selectedAddress.city,
                state: selectedAddress.state,
                zipCode: selectedAddress.zip_code,
              });
              setSelectedAddressId(addressId);
            }
          }}
          onAddNew={() => setSelectedAddressId(null)}
        />
      )}
    </div>
  );
};