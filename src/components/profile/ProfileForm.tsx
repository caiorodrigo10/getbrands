import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";

interface ProfileFormProps {
  form: UseFormReturn<ShippingFormData>;
  onSubmit: (data: ShippingFormData) => Promise<void>;
  isSaving: boolean;
}

export const ProfileForm = ({ form, onSubmit, isSaving }: ProfileFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ContactFields form={form} />
        <AddressFields form={form} />
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};