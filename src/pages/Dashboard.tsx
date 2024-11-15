import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Package, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsOverview from "@/components/dashboard/ProjectsOverview";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: meetings } = useQuery({
    queryKey: ["meetings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: meetingsData } = await supabase
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

      // Add example participants for each meeting
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
    enabled: !!user?.id,
  });

  const { data: products } = useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("project_products")
        .select(`
          product:products (*)
        `)
        .limit(3);
      return data?.map(item => item.product) as Product[];
    },
    enabled: !!user?.id,
  });

  const { data: catalogProducts } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(8);
      return data as Product[];
    },
  });

  const { data: samples } = useQuery({
    queryKey: ["samples", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
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
      return data;
    },
    enabled: !!user?.id,
  });

  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "there";

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader userName={userName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsOverview projects={projects || []} />
        <UpcomingMeetings meetings={meetings || []} />
      </div>

      {/* Your Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Products</h2>
          <Button variant="ghost" onClick={() => navigate("/products")}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Catalog Carousel */}
      <div className="overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Button variant="ghost" onClick={() => navigate("/catalog")}>
            View Full Catalog <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {catalogProducts?.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Sample Requests */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Sample Requests</h2>
          <Button variant="ghost" onClick={() => navigate("/sample-orders")}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samples?.map((sample) => (
            <Card key={sample.id} className="p-4">
              <div className="flex items-start gap-4">
                <Package className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">Order #{sample.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {sample.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sample.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
