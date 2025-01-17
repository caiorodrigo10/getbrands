import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <Button 
        onClick={() => navigate("/")}
        className="bg-primary hover:bg-primary-dark text-white"
      >
        Go to Homepage
      </Button>
    </div>
  );
};

export default NotFound;