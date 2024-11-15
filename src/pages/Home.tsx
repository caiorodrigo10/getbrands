import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export const Home = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.email}</h1>
      <p className="text-muted-foreground">
        This is your dashboard. Start by exploring our products or creating a new project.
      </p>
    </div>
  );
};

export default Home;