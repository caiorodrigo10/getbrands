import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import FeaturedSlider from "@/components/FeaturedSlider";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { CartButton } from "@/components/CartButton";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CatalogLayoutProps {
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const CatalogLayout = ({ onRequestSample, onSelectProduct }: CatalogLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);
  const [availablePoints, setAvailablePoints] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    data: productsData, 
    isLoading,
    error 
  } = useProducts({ 
    page: currentPage,
  });

  useEffect(() => {
    if (user) {
      // Fetch user's projects
      const fetchProjects = async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load projects.",
          });
        } else if (data) {
          setProjects(data);
        }
      };

      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      // Fetch project points
      const fetchProjectPoints = async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('points, points_used')
          .eq('id', selectedProject)
          .single();
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load project points.",
          });
        } else if (data) {
          const available = (data.points || 0) - (data.points_used || 0);
          setAvailablePoints(available);
        }
      };

      fetchProjectPoints();
    }
  }, [selectedProject]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Failed to load products. Please try again.",
    });
  }

  return (
    <div className="space-y-8 px-4 md:px-0">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mt-2">Choose a product to customize</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-64">
            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name} ({(project.points - project.points_used)} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:flex-1 overflow-x-auto">
            <CatalogFilters />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        <div>
          <FeaturedSlider />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <ProductGrid
            products={productsData.data}
            onRequestSample={onRequestSample}
            onSelectProduct={onSelectProduct}
            projectId={selectedProject}
            availablePoints={availablePoints}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products found.</p>
          </div>
        )}
        
        {productsData?.totalPages && productsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <CatalogPagination
              currentPage={currentPage}
              totalPages={productsData.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogLayout;