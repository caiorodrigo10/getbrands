import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FunnelData {
  label: string;
  value: number;
  percentage: number;
}

const SalesFunnel = () => {
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ["sales-funnel"],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get users with projects
      const { count: usersWithProjects } = await supabase
        .from('projects')
        .select('user_id', { count: 'exact', head: true })
        .not('user_id', 'is', null);

      // Get users with sample requests
      const { count: usersWithSamples } = await supabase
        .from('sample_requests')
        .select('user_id', { count: 'exact', head: true })
        .not('user_id', 'is', null);

      // Get users with completed orders
      const { count: usersWithOrders } = await supabase
        .from('sample_requests')
        .select('user_id', { count: 'exact', head: true })
        .eq('status', 'completed');

      const data: FunnelData[] = [
        {
          label: "1. Total Users",
          value: totalUsers || 0,
          percentage: 100
        },
        {
          label: "2. Created Projects",
          value: usersWithProjects || 0,
          percentage: totalUsers ? Math.round((usersWithProjects || 0) / totalUsers * 100) : 0
        },
        {
          label: "3. Requested Samples",
          value: usersWithSamples || 0,
          percentage: totalUsers ? Math.round((usersWithSamples || 0) / totalUsers * 100) : 0
        },
        {
          label: "4. Completed Orders",
          value: usersWithOrders || 0,
          percentage: totalUsers ? Math.round((usersWithOrders || 0) / totalUsers * 100) : 0
        }
      ];

      return data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallConversion = funnelData ? 
    Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100) || 0 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Sales Funnel</span>
          <span className="text-sm font-normal text-muted-foreground">
            Overall Conversion: {overallConversion}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {funnelData?.map((step, index) => (
            <div 
              key={step.label}
              className="flex-1 relative"
            >
              <div 
                className="h-20 bg-red-100 relative overflow-hidden rounded-lg"
                style={{
                  clipPath: index === 0 
                    ? 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' 
                    : index === funnelData.length - 1
                    ? 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
                    : 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)'
                }}
              >
                <div 
                  className="absolute inset-0 bg-red-500/20"
                  style={{
                    width: `${step.percentage}%`
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-sm">
                  <span className="font-medium">{step.value}</span>
                  <span className="text-xs text-muted-foreground">
                    {step.percentage}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-center font-medium">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnel;