import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SimpleProductCard from "@/components/SimpleProductCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsOverview from "@/components/dashboard/ProjectsOverview";
import ProjectDetails from "@/components/dashboard/ProjectDetails";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    profile,
    projects,
    meetings,
    products,
    catalogProducts,
    samples,
    isAuthenticated,
  } = useDashboardData();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "there";

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader userName={userName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsOverview projects={projects || []} />
        <UpcomingMeetings meetings={meetings || []} />
      </div>

      {/* Project Details */}
      <ProjectDetails />

      {/* Your Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Products</h2>
          <Button variant="ghost" onClick={() => navigate("/products")}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.slice(0, 3).map((item) => {
            const specificProduct = item.specific?.[0];
            const displayProduct = {
              ...item.product,
              name: specificProduct?.name || item.product?.name,
              image_url: specificProduct?.image_url || item.product?.image_url,
              id: item.product?.id,
            };
            return (
              <SimpleProductCard 
                key={item.id} 
                product={displayProduct}
                projectName={item.project?.name}
              />
            );
          })}
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