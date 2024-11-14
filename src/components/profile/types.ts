import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email(),
  phone: z.string().optional(),
  shipping_address_street: z.string().min(5, "Street address is required"),
  shipping_address_street2: z.string().optional(),
  shipping_address_city: z.string().min(2, "City is required"),
  shipping_address_state: z.string().min(2, "State is required"),
  shipping_address_zip: z.string().min(5, "ZIP code is required"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;