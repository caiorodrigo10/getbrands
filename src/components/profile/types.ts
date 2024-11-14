import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  address_street: z.string().min(5, "Street address is required"),
  address_city: z.string().min(2, "City is required"),
  address_state: z.string().min(2, "State is required"),
  address_zip: z.string().min(5, "ZIP code is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;