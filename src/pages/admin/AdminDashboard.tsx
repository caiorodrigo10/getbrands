import { Users, ShoppingBag, Package, TrendingUp, Star, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import SalesFunnel from "@/components/admin/dashboard/SalesFunnel";
import MonthlyRevenue from "@/components/admin/dashboard/MonthlyRevenue";
import ProjectStatus from "@/components/admin/dashboard/ProjectStatus";
import QuizFunnelAnalysis from "@/components/admin/reports/QuizFunnelAnalysis";

const recentActivities = [
  {
    id: 1,
    type: "registration",
    description: "New user registration: Sarah Johnson",
    timestamp: "2 hours ago",
    status: "success"
  },
  {
    id: 2,
    type: "sample",
    description: "Sample order #123 shipped to Michael Chen",
    timestamp: "3 hours ago",
    status: "success"
  },
  {
    id: 3,
    type: "project",
    description: "Project 'Beauty Brand Launch' status updated to 'In Progress'",
    timestamp: "5 hours ago",
    status: "pending"
  },
  {
    id: 4,
    type: "order",
    description: "New bulk order received from Wellness Co.",
    timestamp: "6 hours ago",
    status: "success"
  },
  {
    id: 5,
    type: "project",
    description: "Package design approved for 'Organic Essentials'",
    timestamp: "8 hours ago",
    status: "success"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin dashboard. Here's what's happening with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Members"
          value="1,234"
          change={12}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Average Order Value"
          value="$328"
          change={8.2}
          icon={<ShoppingBag className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="Samples Sold"
          value="856"
          change={-3.1}
          icon={<Package className="w-6 h-6 text-primary" />}
        />
        <StatsCard
          title="NPS Score"
          value="72"
          change={5.3}
          icon={<Star className="w-6 h-6 text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesFunnel />
        <MonthlyRevenue />
      </div>

      <QuizFunnelAnalysis />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatus />
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Circle className={`w-2 h-2 mt-2 ${getStatusColor(activity.status)}`} fill="currentColor" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;