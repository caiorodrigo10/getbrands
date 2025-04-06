
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const FavoriteButton = ({ 
  productId, 
  size = "md", 
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavorited = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  // Set button size based on props
  const buttonSizeClass = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-10 w-10"
  };

  // Set icon size based on button size
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        buttonSizeClass[size],
        "rounded-full p-0 flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white",
        className
      )}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        size={iconSize[size]}
        className={cn(
          isFavorited 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-transparent text-gray-600",
          "transition-colors"
        )}
      />
    </Button>
  );
};
