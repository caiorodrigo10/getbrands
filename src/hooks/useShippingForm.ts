
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
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
  useSameForBilling: z.boolean().default(true),
  // Make billing fields conditional based on useSameForBilling
  billingAddress1: z.string().optional().refine(
    (val) => val !== undefined, 
    { message: "Billing address is required when not using same address" }
  ),
  billingAddress2: z.string().optional(),
  billingCity: z.string().optional().refine(
    (val) => val !== undefined,
    { message: "Billing city is required when not using same address" }
  ),
  billingState: z.string().optional().refine(
    (val) => val !== undefined,
    { message: "Billing state is required when not using same address" }
  ),
  billingZipCode: z.string().optional().refine(
    (val) => val !== undefined,
    { message: "Billing ZIP code is required when not using same address" }
  ),
});

export const useShippingForm = () => {
  // Get saved values from localStorage once
  const getSavedValues = () => {
    // Get all values from localStorage
    const values = {
      firstName: localStorage.getItem('firstName') || "",
      lastName: localStorage.getItem('lastName') || "",
      address1: localStorage.getItem('shipping_address') || "",
      address2: localStorage.getItem('shipping_address2') || "",
      city: localStorage.getItem('shipping_city') || "",
      state: localStorage.getItem('shipping_state') || "",
      zipCode: localStorage.getItem('shipping_zip') || "",
      phone: localStorage.getItem('phone') || "",
      useSameForBilling: localStorage.getItem('useSameForBilling') !== 'false', // Default to true
      billingAddress1: localStorage.getItem('billing_address') || "",
      billingAddress2: localStorage.getItem('billing_address2') || "",
      billingCity: localStorage.getItem('billing_city') || "",
      billingState: localStorage.getItem('billing_state') || "",
      billingZipCode: localStorage.getItem('billing_zip') || "",
    };

    console.log("Getting saved form values from localStorage:", values);
    return values;
  };

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getSavedValues(),
    mode: "onChange",
  });

  // Log initial form values
  useEffect(() => {
    console.log('Initial shipping form values:', form.getValues());
  }, [form]);

  return form;
};
