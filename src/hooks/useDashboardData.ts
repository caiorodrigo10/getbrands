
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
        // For admin users or when there are RLS permissions issues, use mocked data
        if (user?.user_metadata?.role === 'admin') {
          return [
            {
              id: "1",
              project: { id: "p1", name: "Beauty Brand Launch", description: "Luxury cosmetics launch" },
              product: {
                id: "prod1",
                name: "Facial Cleanser",
                category: "skincare",
                from_price: 12.99,
                srp: 24.99,
                image_url: "https://images.unsplash.com/photo-1556228852-6d35a585d566"
              },
              specific: [
                {
                  id: "sp1",
                  name: "Gentle Facial Cleanser",
                  description: "Custom formulated for sensitive skin",
                  image_url: "https://images.unsplash.com/photo-1556228852-6d35a585d566",
                  selling_price: 22.99
                }
              ]
            },
            {
              id: "2",
              project: { id: "p1", name: "Beauty Brand Launch", description: "Luxury cosmetics launch" },
              product: {
                id: "prod2",
                name: "Moisturizing Cream",
                category: "skincare",
                from_price: 18.99,
                srp: 32.99,
                image_url: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
              },
              specific: [
                {
                  id: "sp2",
                  name: "Hydrating Moisturizer",
                  description: "24-hour hydration with natural ingredients",
                  image_url: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
                  selling_price: 29.99
                }
              ]
            },
            {
              id: "3",
              project: { id: "p2", name: "Wellness Collection", description: "Natural wellness products" },
              product: {
                id: "prod3",
                name: "Essential Oil Diffuser",
                category: "wellness",
                from_price: 24.99,
                srp: 44.99,
                image_url: "https://images.unsplash.com/photo-1608571423539-e951a27ea9e9"
              },
              specific: [
                {
                  id: "sp3",
                  name: "Ultrasonic Aroma Diffuser",
                  description: "Silent operation with color-changing LED",
                  image_url: "https://images.unsplash.com/photo-1608571423539-e951a27ea9e9",
                  selling_price: 39.99
                }
              ]
            }
          ];
        }
        
        // Try to fetch data from database
        const { data, error } = await supabase
          .from('project_products')
          .select(`
            id,
            projects:project_id (
              id,
              name,
              description
            ),
            products:product_id (
              id,
              name,
              category,
              from_price,
              srp,
              image_url
            ),
            project_specific_products (
              id,
              name,
              description,
              image_url,
              selling_price
            )
          `)
          .eq('projects.user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error loading products:", error);
          toast({
            variant: "destructive",
            title: "Error loading products",
            description: error.message
          });
          
          // Return empty array on error
          return [];
        }
        
        // Transform the data to match expected format for the Dashboard component
        if (data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            project: item.projects,
            product: item.products,
            specific: item.project_specific_products
          }));
        }
        
        return [];
      } catch (err) {
        console.error("Unexpected error loading products:", err);
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
