import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Simulated authentication - In a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      const mockUser = {
        id: "d7bed82c-0d74-4b4d-a6cd-0fb0bead6c2a", // Valid UUID format
        email: email,
        app_metadata: {},
        user_metadata: {
          name: email.split("@")[0],
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      // Create or update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.user_metadata.name,
          avatar_url: mockUser.user_metadata.avatar_url,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating/updating profile:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create user profile. Please try again.",
        });
        return;
      }
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log in. Please try again.",
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};