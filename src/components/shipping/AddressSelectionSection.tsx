import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SavedAddressSelect } from "@/components/shipping/SavedAddressSelect";
import { Address } from "@/types/shipping";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-auto">
              Select Another Address
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Saved Addresses</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
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
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};