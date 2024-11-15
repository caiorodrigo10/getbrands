import { Users, ShoppingBag, Package, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import SalesFunnel from "@/components/admin/dashboard/SalesFunnel";
import MonthlyRevenue from "@/components/admin/dashboard/MonthlyRevenue";
import ProjectStatus from "@/components/admin/dashboard/ProjectStatus";

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatus />
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          {/* We'll implement this in the next iteration */}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;