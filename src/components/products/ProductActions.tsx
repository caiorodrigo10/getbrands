
import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUserPermissions } from "@/lib/permissions";
import { Video } from "lucide-react";
import { useEffect } from "react";

interface ProductActionsProps {
  productId: string;
  onSelectProduct: () => void;
  showNotification?: boolean;
}

export const ProductActions = ({ productId, onSelectProduct, showNotification = true }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasFullAccess, isMember, isSampler, isAdmin, profile } = useUserPermissions();
  
  // Enhanced logging for permissions
  useEffect(() => {
    console.log("ProductActions - User permissions:", {
      hasFullAccess,
      isMember,
      isSampler,
      isAdmin,
      role: profile?.role
    });
  }, [hasFullAccess, isMember, isSampler, isAdmin, profile]);
  
  // Either full access or admin can select products
  const canSelectProduct = hasFullAccess || isAdmin;

  const handleOrderSample = async () => {
    try {
      const success = await handleRequestSample();
      if (success) {
        // Add a small delay to ensure cart state is updated
        setTimeout(() => {
          navigate("/checkout/confirmation", { replace: true });
        }, 800);
      }
    } catch (error) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button 
        size="lg"
        className="w-full bg-[#08af71] hover:bg-[#08af71]/90 text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleOrderSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Order Sample"}
      </Button>
      
      {canSelectProduct ? (
        <Button 
          size="lg"
          className="w-full bg-primary hover:bg-primary-dark text-white h-14 sm:h-12 text-base font-medium rounded-full"
          onClick={onSelectProduct}
          disabled={isLoading}
        >
          Select Product
        </Button>
      ) : (isMember || isSampler) && (
        <Button 
          size="lg"
          className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white h-14 sm:h-12 text-base font-medium rounded-full"
          onClick={() => navigate("/schedule-demo")}
          disabled={isLoading}
        >
          <Video className="h-5 w-5 mr-2" />
          Schedule Demo
        </Button>
      )}
    </div>
  );
};

export default ProductActions;
