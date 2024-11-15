import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavedAddressSelect } from "@/components/shipping/SavedAddressSelect";
import { Address } from "@/types/shipping";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [open, setOpen] = useState(false);

  if (!addresses?.length || addresses.length <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-auto sm:w-auto sm:text-base text-xs px-2 sm:px-4 h-7 sm:h-9"
            >
              Select Previous Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Select from previous addresses</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <SavedAddressSelect
                userId={user.id}
                selectedAddressId={selectedAddressId}
                onAddressSelect={(addressId) => {
                  const selectedAddress = addresses.find(addr => addr.id === addressId);
                  if (selectedAddress) {
                    form.reset({
                      ...form.getValues(),
                      firstName: selectedAddress.first_name || "",
                      lastName: selectedAddress.last_name || "",
                      phone: selectedAddress.phone || "",
                      address1: selectedAddress.street_address1,
                      address2: selectedAddress.street_address2 || "",
                      city: selectedAddress.city,
                      state: selectedAddress.state,
                      zipCode: selectedAddress.zip_code,
                    });
                    setSelectedAddressId(addressId);
                    setOpen(false);
                  }
                }}
                onAddNew={() => {
                  setSelectedAddressId(null);
                  setOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};