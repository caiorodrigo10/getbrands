import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface ClientSamplesProps {
  userId: string | undefined;
}

export const ClientSamples = ({ userId }: ClientSamplesProps) => {
  const { data: sampleRequests } = useQuery({
    queryKey: ["client-samples", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("sample_requests")
        .select(`
          *,
          product:products (
            name,
            image_url
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (!userId || !sampleRequests?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Sample Requests</h2>
        <p className="text-muted-foreground">No sample requests yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Sample Requests</h2>
      <div className="space-y-4">
        {sampleRequests.map((request) => (
          <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={request.product?.image_url || "/placeholder.svg"}
                alt={request.product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium">{request.product?.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <Badge 
                  variant={request.status === "completed" ? "default" : "secondary"}
                >
                  {request.status}
                </Badge>
                {request.tracking_number && (
                  <span className="text-sm text-muted-foreground">
                    Tracking: {request.tracking_number}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};