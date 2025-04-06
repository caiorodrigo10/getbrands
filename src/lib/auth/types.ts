
import { User } from "@supabase/supabase-js";
import { Json } from "@/integrations/supabase/types";

export interface ProfileType {
  id: string;
  email: string;
  onboarding_completed: boolean;
  role: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  shipping_address_street: string | null;
  shipping_address_street2: string | null;
  shipping_address_city: string | null;
  shipping_address_state: string | null;
  shipping_address_zip: string | null;
  billing_address_street: string | null;
  billing_address_street2: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_zip: string | null;
  instagram_handle: string | null;
  product_interest: Json | null;
  profile_type: string | null;
  brand_status: string | null;
  launch_urgency: string | null;
  language: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Define a type for user roles for better type safety throughout the application
export type UserRole = 'admin' | 'member' | 'sampler' | 'customer';
