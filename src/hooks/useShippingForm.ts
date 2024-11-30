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
  // Get saved values from localStorage
  const savedValues = {
    firstName: localStorage.getItem('firstName') || "",
    lastName: localStorage.getItem('lastName') || "",
    address1: localStorage.getItem('shipping_address') || "",
    address2: localStorage.getItem('shipping_address2') || "",
    city: localStorage.getItem('shipping_city') || "",
    state: localStorage.getItem('shipping_state') || "",
    zipCode: localStorage.getItem('shipping_zip') || "",
    phone: localStorage.getItem('phone') || "",
    useSameForBilling: localStorage.getItem('useSameForBilling') === 'true',
    billingAddress1: localStorage.getItem('billing_address') || "",
    billingAddress2: localStorage.getItem('billing_address2') || "",
    billingCity: localStorage.getItem('billing_city') || "",
    billingState: localStorage.getItem('billing_state') || "",
    billingZipCode: localStorage.getItem('billing_zip') || "",
  };

  return useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: savedValues,
    mode: "onChange",
  });
};