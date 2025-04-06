
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserPermissions } from "@/lib/permissions";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import SimpleProductCard from "@/components/SimpleProductCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectsOverview from "@/components/dashboard/ProjectsOverview";
import ProjectDetails from "@/components/dashboard/ProjectDetails";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasFullAccess, isAdmin, profile } = useUserPermissions();
  const {
    profile: dashboardProfile,
    projects,
    meetings,
    products,
    catalogProducts,
    samples,
    isAuthenticated,
  } = useDashboardData();

  const canAccessDashboard = hasFullAccess || isAdmin === true;

  useEffect(() => {
    console.log("Dashboard - Checking permissions:", {
      hasFullAccess,
      isAdmin,
      canAccessDashboard,
      profileRole: profile?.role
    });
    
    if (!canAccessDashboard) {
      console.log("Redirecting: user doesn't have permission to access the Dashboard");
      navigate('/catalog');
    }
  }, [hasFullAccess, isAdmin, profile, navigate, canAccessDashboard]);

  if (!isAuthenticated || !canAccessDashboard) {
    return null;
  }

  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "there";

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader userName={userName} />
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <ProjectsOverview projects={projects || []} />
          <UpcomingMeetings meetings={meetings || []} />
        </div>
        
        <div className="col-span-12 lg:col-span-5">
          <ProjectDetails />
        </div>
      </div>

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
            const product = item.product;
            const projectName = item.project?.name;
            
            if (!product) return null;
            
            return (
              <SimpleProductCard 
                key={item.id} 
                product={product}
                projectName={projectName}
                clickable={false} // Set to false to make it non-clickable
              />
            );
          })}
          
          {(!products || products.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">No products selected yet.</p>
            </div>
          )}
        </div>
      </div>

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
          
          {(!samples || samples.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">No sample requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
