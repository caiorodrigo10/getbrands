
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Star size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Sign in to view favorites</h2>
        <p className="text-gray-500 mb-6">
          You need to be logged in to use the favorites feature
        </p>
        <Button onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-page-title mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Products you've marked as favorites</p>
      </div>
      
      <FavoritesGrid />
    </div>
  );
};

export default Favorites;
