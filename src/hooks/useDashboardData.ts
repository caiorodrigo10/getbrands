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
      return [
        {
          id: "1",
          project: { name: "Brand Identity Project" },
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          meeting_link: "https://meet.google.com/example",
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
        },
        {
          id: "2",
          project: { name: "Package Design Review" },
          scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          meeting_link: "https://zoom.us/example",
          participants: [
            {
              id: "3",
              name: "Emily Davis",
              avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            }
          ]
        }
      ];
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: Infinity,
  });

  const { data: products } = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('project_products')
        .select(`
          id,
          project:projects (
            id,
            name,
            description
          ),
          product:products (*),
          specific:project_specific_products (
            id,
            name,
            description,
            image_url,
            selling_price
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: error.message
        });
        throw error;
      }
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 30000,
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
    staleTime: 30000,
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
