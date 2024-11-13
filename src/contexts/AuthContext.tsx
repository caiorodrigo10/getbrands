import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulated authentication - In a real app, this would connect to a backend
  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser = {
      id: "1",
      email: email,
      app_metadata: {},
      user_metadata: {
        name: email.split("@")[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      },
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
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