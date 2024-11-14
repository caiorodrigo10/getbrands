import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ShippingFormData } from "@/types/shipping";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  address1: z.string().min(5, "Address is too short"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is too short"),
  state: z.string().min(2, "Invalid state"),
  zipCode: z.string().min(5, "Invalid ZIP code"),
  phone: z.string().min(10, "Invalid phone number"),
  useSameForBilling: z.boolean().default(true),
  billingAddress1: z.string().min(5, "Address is too short").optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(2, "City is too short").optional(),
  billingState: z.string().min(2, "Invalid state").optional(),
  billingZipCode: z.string().min(5, "Invalid ZIP code").optional(),
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
  });
};