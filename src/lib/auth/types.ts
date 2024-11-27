import { User } from "@supabase/supabase-js";

export interface ProfileType {
  onboarding_completed: boolean;
  role: string;
  first_name: string | null;
  last_name: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}