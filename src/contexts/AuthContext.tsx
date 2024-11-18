import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Gleap from "gleap";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const identifyUserInGleap = async (currentUser: User | null) => {
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', currentUser.id)
        .single();

      const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0] || 'User';
      
      Gleap.identify(currentUser.id, {
        email: currentUser.email,
        name: fullName,
      });
    } else {
      Gleap.clearIdentity();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          identifyUserInGleap(initialSession.user);
          
          // Only redirect to dashboard if on login page
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        } else if (location.pathname !== '/login') {
          // If no session and not on login page, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession) => {
      console.log('Auth event:', event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        identifyUserInGleap(currentSession.user);
        
        if (location.pathname === '/login') {
          navigate('/dashboard');
        }
      } else {
        setSession(null);
        setUser(null);
        identifyUserInGleap(null);
        
        // Only redirect to login if not already there
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: "Email ou senha inválidos. Por favor, verifique suas credenciais.",
        });
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        identifyUserInGleap(data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Primeiro limpa o estado local
      setUser(null);
      setSession(null);
      identifyUserInGleap(null);

      // Tenta fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Força a limpeza da sessão no localStorage
      window.localStorage.removeItem('supabase.auth.token');
      
      // Navega para a página de login e previne redirecionamentos indesejados
      navigate('/login', { replace: true });

      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso!",
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      
      // Sempre navega para login mesmo se houver erro
      navigate('/login', { replace: true });
      
      if (!error.message?.includes('session_not_found')) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro durante o logout.",
        });
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        isAuthenticated: !!session
      }}
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