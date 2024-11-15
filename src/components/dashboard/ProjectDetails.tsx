import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

interface Stage {
  title: string;
  description: string;
  status: "pending" | "completed" | "in-progress";
}

const stages: Stage[] = [
  {
    title: "Onboarding",
    description: "Schedule a call with our team to start your project",
    status: "pending",
  },
  {
    title: "Product Selection",
    description: "Choose products for your project",
    status: "pending",
  },
  {
    title: "Naming",
    description: "Brand name development",
    status: "pending",
  },
  {
    title: "Visual Identity",
    description: "Creation of your brand's visual identity",
    status: "completed",
  },
  {
    title: "Package Design",
    description: "Design of your product packages",
    status: "pending",
  },
  {
    title: "E-commerce",
    description: "Implementation of your online store",
    status: "pending",
  },
];

const ProjectDetails = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Initial Project</h2>
      </div>
      <div className="space-y-6">
        {stages.map((stage) => (
          <div key={stage.title} className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{stage.title}</h3>
              <StatusBadge status={stage.status} />
            </div>
            <p className="text-sm text-muted-foreground">{stage.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectDetails;