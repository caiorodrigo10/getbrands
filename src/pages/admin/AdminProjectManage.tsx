import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StagesTimeline from "@/components/StagesTimeline";

const AdminProjectManage = () => {
  // Demo data - this would be fetched from the API in a real implementation
  const project = {
    id: 1,
    name: "Eco-Friendly Packaging",
    description: "Sustainable packaging solutions for beauty products",
    client: {
      name: "Green Earth Co",
      email: "contact@greenearth.co",
      phone: "+1 (555) 123-4567",
      address: "123 Green Street, Eco City, EC 12345"
    },
    status: "Active",
    progress: 65,
    accountManager: "Sarah Johnson",
    points: 850,
    lastUpdate: "Product selection phase completed",
    updatedAt: "2024-02-15T10:30:00Z",
    startDate: "2024-01-15",
    expectedCompletion: "2024-05-15"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500">
          {project.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client Name</p>
              <p className="font-medium">{project.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{project.client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{project.client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{project.client.address}</p>
            </div>
          </div>
        </Card>

        {/* Project Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Account Manager</p>
              <p className="font-medium">{project.accountManager}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{project.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Completion</p>
              <p className="font-medium">{project.expectedCompletion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="font-medium">{project.points} points</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-full bg-muted/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[40px]">
            {project.progress}%
          </span>
        </div>
        <Separator className="my-6" />
        <StagesTimeline />
      </Card>
    </div>
  );
};

export default AdminProjectManage;