import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Users, FolderKanban, ShoppingBag } from "lucide-react";

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalSampleRequests }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('sample_requests').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: totalUsers,
        projects: totalProjects,
        samples: totalSampleRequests
      };
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const cards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Projects",
      value: stats?.projects || 0,
      icon: FolderKanban,
      color: "text-green-600"
    },
    {
      title: "Sample Requests",
      value: stats?.samples || 0,
      icon: ShoppingBag,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Overview of your platform's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-semibold mt-1">{card.value}</p>
                </div>
                <Icon className={cn("h-8 w-8", card.color)} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* We'll implement the activity feed in the next iteration */}
          <p className="text-gray-500">No recent activity</p>
        </div>
      </Card>
    </div>
  );
};