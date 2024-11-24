import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ShippingFormData } from "@/types/shipping";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  phone: z.string().min(10, "Phone number is required"),
  useSameForBilling: z.boolean(),
  billingAddress1: z.string().min(5, "Billing address is required").optional().or(z.string()),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(2, "Billing city is required").optional().or(z.string()),
  billingState: z.string().min(2, "Billing state is required").optional().or(z.string()),
  billingZipCode: z.string().min(5, "Billing ZIP code is required").optional().or(z.string()),
});

export const useShippingForm = () => {
  return useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      useSameForBilling: true,
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
    },
    mode: "onChange",
  });
};