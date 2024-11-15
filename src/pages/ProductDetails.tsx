import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });

  const handleRequestSample = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You need to be logged in to request samples.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (product) {
        await addItem(product);
        toast({
          title: "Success",
          description: "Product added to cart successfully.",
        });
        navigate("/checkout/confirmation");
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select products.",
      });
      return;
    }

    // Fetch user's projects
    const { data: userProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);

    if (projectsError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects. Please try again.",
      });
      return;
    }

    // Check if user has any projects with enough points
    const availableProjects = userProjects?.filter(
      project => (project.points - (project.points_used || 0)) >= 1000
    ) || [];

    if (availableProjects.length === 0) {
      navigate("/checkout/points");
    } else {
      setProjects(availableProjects);
      setShowProjectDialog(true);
    }
  };

  const handleProjectSelection = async (projectId: string) => {
    try {
      // First check if product already exists in project
      const { data: existingProduct, error: checkError } = await supabase
        .from('project_products')
        .select('*')
        .eq('project_id', projectId)
        .eq('product_id', id)
        .maybeSingle();

      if (existingProduct) {
        toast({
          variant: "destructive",
          title: "Product already selected",
          description: "This product is already in your project.",
        });
        return;
      }

      // Get current project points
      const { data: currentProject, error: projectError } = await supabase
        .from('projects')
        .select('points_used, name')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      // Update project points (add 1000 to points_used)
      const newPointsUsed = (currentProject?.points_used || 0) + 1000;
      const { error: updateError } = await supabase
        .from('projects')
        .update({ points_used: newPointsUsed })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Add product to project
      const { error: insertError } = await supabase
        .from('project_products')
        .insert({
          project_id: projectId,
          product_id: id
        });

      if (insertError) throw insertError;

      // Navigate to success page with product and project info - FIXED PATH
      navigate("/products/success", {
        state: {
          product: {
            name: product?.name,
            image_url: product?.image_url
          },
          project: {
            name: currentProject.name
          }
        },
        replace: true
      });

    } catch (error) {
      console.error('Error selecting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select product. Please try again.",
      });
    }
  };

  if (productLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const profit = product.srp - product.from_price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Images */}
        <div className="space-y-6">
          <div className="relative">
            {product.is_new && (
              <Badge className="absolute top-4 left-4 bg-primary">NEW</Badge>
            )}
            {product.is_tiktok && (
              <Badge className="absolute top-4 right-4 bg-pink-600">SELL ON TIKTOK</Badge>
            )}
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.image_url || "/placeholder.svg"}
                alt={`${product.name} - View ${i}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:ring-2 ring-primary"
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-xl text-gray-600">Ships exclusively to US</p>
            <p className="text-gray-700 text-lg">{product.description}</p>
          </div>

          <div>
            <div className="text-4xl font-bold mb-4">
              ${product.from_price.toFixed(2)}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span>Sell more, pay less!</span>
                <Button variant="link" className="text-primary">
                  View Volume Discounts
                </Button>
              </div>

              <div className="flex items-center justify-between text-lg">
                <span>Large business?</span>
                <Button variant="link" className="text-primary">
                  Unlock Special Pricing
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-gray-600">Shipping cost</p>
                  <p className="text-lg">From ${(4.50).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Suggested retail price</p>
                  <p className="text-lg">${product.srp.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Potential profit</p>
                  <p className="text-lg text-green-600 font-semibold">
                    ${profit.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleSelectProduct}
                >
                  Select Product
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleRequestSample}
                  disabled={isLoading}
                >
                  {isLoading ? "Adding to cart..." : "Request Sample"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
            <div className="text-center">
              <Icons.skinHealth className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm">Skin Health</p>
            </div>
            <div className="text-center">
              <Icons.vegetarian className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm">Vegetarian</p>
            </div>
            <div className="text-center">
              <Icons.natural className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm">100% Natural</p>
            </div>
            <div className="text-center">
              <Icons.noGmo className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-sm">No GMO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold">Product Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Key Ingredients</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Aloe Vera: Deep hydration</li>
              <li>Tea Tree Oil: Purifying properties</li>
              <li>Cucumber Extract: Soothing effect</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Benefits</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Reduces redness</li>
              <li>Balances skin</li>
              <li>Deep hydration</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How to Use</h3>
            <p>Apply to clean, dry skin, gently massaging. Use twice daily for best results.</p>
          </div>
        </div>
      </div>

      {product && (
        <ProjectSelectionDialog 
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductDetails;
