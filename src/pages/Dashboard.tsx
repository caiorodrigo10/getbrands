import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Package, ArrowRight } from "lucide-react";
import ProjectProgress from "@/components/ProjectProgress";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

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
      const { data } = await supabase
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
      return data;
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
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome, {userName}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Projects Overview</h2>
            <Button variant="ghost" onClick={() => navigate("/projects")}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            {projects?.map((project) => (
              <div key={project.id} className="space-y-2">
                <h3 className="font-medium">{project.name}</h3>
                <ProjectProgress progress={30} />
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          </div>
          <div className="space-y-4">
            {meetings?.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-start gap-4 p-4 bg-muted/10 rounded-lg"
              >
                <Calendar className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{meeting.project?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meeting.scheduled_for).toLocaleString()}
                  </p>
                  {meeting.meeting_link && (
                    <a
                      href={meeting.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-2 inline-block"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Your Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Products</h2>
          <Button variant="ghost" onClick={() => navigate("/products")}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Catalog Carousel */}
      <div>
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
              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samples?.map((sample) => (
            <Card key={sample.id} className="p-4">
              <div className="flex items-start gap-4">
                <Package className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Order #{sample.id.slice(0, 8)}</p>
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