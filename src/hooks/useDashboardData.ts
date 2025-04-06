
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
      if (!user?.id) return [];
      
      try {
        // Use appropriate client based on user role
        const client = user?.user_metadata?.role === 'admin' ? supabaseAdmin : supabase;
        
        // First, get the user's projects
        const { data: projectsData, error: projectsError } = await client
          .from('projects')
          .select('id')
          .eq('user_id', user.id);

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          throw projectsError;
        }

        if (!projectsData || projectsData.length === 0) {
          return [];
        }

        // Get project IDs to use in the next query
        const projectIds = projectsData.map(project => project.id);
        
        // Get all product selections for the user's projects
        const { data: projectProducts, error: productsError } = await client
          .from('project_products')
          .select(`
            id,
            project_id,
            product_id,
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
              main_image_url,
              images,
              selling_price
            )
          `)
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })
          .limit(3);

        if (productsError) {
          console.error("Error fetching project products:", productsError);
          throw productsError;
        }
        
        // Transform the data to match the expected ProjectProduct structure
        const formattedProducts = projectProducts?.map(item => {
          // Ensure project is an object with expected properties, not an array
          const project = Array.isArray(item.project) && item.project.length > 0 
            ? item.project[0] 
            : item.project || null;

          return {
            id: item.id,
            project: project,
            product: item.product,
            specific: item.specific
          };
        }) || [];
        
        return formattedProducts;
      } catch (err) {
        console.error("Error loading products:", err);
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 30000,
  });

  const { data: catalogProducts } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      try {
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
        return data || [];
      } catch (err) {
        console.error("Error fetching catalog products:", err);
        return [];
      }
    },
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const { data: samples } = useQuery({
    queryKey: ["samples", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        // For admin users, use mock data
        if (user?.user_metadata?.role === 'admin') {
          return [
            {
              id: "s1",
              status: "shipped",
              created_at: new Date().toISOString()
            },
            {
              id: "s2",
              status: "processing",
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: "s3",
              status: "delivered",
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];
        }
        
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
          console.error("Error loading samples:", error);
          toast({
            variant: "destructive",
            title: "Error loading samples",
            description: error.message,
          });
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error("Unexpected error loading samples:", err);
        return [];
      }
    },
    enabled: !!user?.id && isAuthenticated,
  });

  return {
    profile,
    projects,
    meetings,
    products: products || [],
    catalogProducts: catalogProducts || [],
    samples: samples || [],
    isAuthenticated,
  };
};
