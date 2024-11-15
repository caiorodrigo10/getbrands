import { useAuth } from "@/contexts/AuthContext";

export const Home = () => {
  const { user } = useAuth();
  
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