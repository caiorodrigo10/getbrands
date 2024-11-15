import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useDashboardData = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading projects",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: meetings } = useQuery({
    queryKey: ["meetings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: meetingsData, error } = await supabase
        .from("project_meetings")
        .select(`
          *,
          project:projects (
            name
          )
        `)
        .eq("user_id", user.id)
        .gte("scheduled_for", new Date().toISOString())
        .order("scheduled_for", { ascending: true })
        .limit(3);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading meetings",
          description: error.message,
        });
        throw error;
      }

      return meetingsData?.map(meeting => ({
        ...meeting,
        participants: [
          {
            id: "1",
            name: "Sarah Johnson",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          },
          {
            id: "2",
            name: "Michael Chen",
            avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
          }
        ]
      }));
    },
    enabled: !!user?.id && isAuthenticated,
  });

  const { data: products } = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("project_products")
        .select(`
          id,
          product:products (*)
        `)
        .eq("projects.user_id", user.id)
        .limit(3);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: error.message,
        });
        throw error;
      }
      return data?.map(item => item.product) || [];
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 30000, // Add a staleTime to prevent unnecessary refetches
  });

  const { data: catalogProducts } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(8);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading catalog products",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 30000, // Add a staleTime to prevent unnecessary refetches
  });

  const { data: samples } = useQuery({
    queryKey: ["samples", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("sample_requests")
        .select(`
          *,
          products:sample_request_products (
            product:products (*)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading samples",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  return {
    profile,
    projects,
    meetings,
    products,
    catalogProducts,
    samples,
    isAuthenticated,
  };
};