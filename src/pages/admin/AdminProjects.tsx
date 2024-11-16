import { useState } from "react";
import { Input } from "@/components/ui/input";
import AdminProjectsTable from "@/components/admin/projects/AdminProjectsTable";

// Demo data with 10 example projects
const demoProjects = [
  {
    id: 1,
    name: "Eco-Friendly Packaging",
    client: "Green Earth Co",
    email: "contact@greenearth.co",
    phone: "+1 (555) 123-4567",
    status: "Active",
    progress: 65,
    accountManager: "Sarah Johnson",
    points: 850,
    lastUpdate: "Product selection phase completed",
    updatedAt: "2024-02-15T10:30:00Z",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: 2,
    name: "Tech Startup Branding",
    client: "InnovateTech",
    email: "hello@innovatetech.com",
    phone: "+1 (555) 234-5678",
    status: "Pending",
    progress: 30,
    accountManager: "Michael Chen",
    points: 1200,
    lastUpdate: "Initial consultation scheduled",
    updatedAt: "2024-02-14T15:45:00Z",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 3,
    name: "Wellness Product Line",
    client: "Vital Balance",
    email: "info@vitalbalance.com",
    phone: "+1 (555) 345-6789",
    status: "Completed",
    progress: 100,
    accountManager: "Emily Rodriguez",
    points: 950,
    lastUpdate: "Final delivery approved",
    updatedAt: "2024-02-13T09:15:00Z",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: 4,
    name: "Digital Solutions Brand",
    client: "ByteCraft Solutions",
    email: "contact@bytecraft.dev",
    phone: "+1 (555) 456-7890",
    status: "Active",
    progress: 45,
    accountManager: "David Kim",
    points: 1500,
    lastUpdate: "Logo design approved",
    updatedAt: "2024-02-12T14:20:00Z",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    id: 5,
    name: "Organic Food Brand",
    client: "Nature's Best",
    email: "hello@naturesbest.com",
    phone: "+1 (555) 567-8901",
    status: "Active",
    progress: 80,
    accountManager: "Lisa Thompson",
    points: 750,
    lastUpdate: "Packaging design in progress",
    updatedAt: "2024-02-11T11:30:00Z",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: 6,
    name: "Smart Home Devices",
    client: "Connected Living",
    email: "projects@connected.io",
    phone: "+1 (555) 678-9012",
    status: "Pending",
    progress: 15,
    accountManager: "James Wilson",
    points: 2000,
    lastUpdate: "Project scope defined",
    updatedAt: "2024-02-10T16:45:00Z",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 7,
    name: "Fitness Equipment",
    client: "Peak Performance",
    email: "info@peakfit.com",
    phone: "+1 (555) 789-0123",
    status: "Active",
    progress: 60,
    accountManager: "Anna Martinez",
    points: 1100,
    lastUpdate: "Product testing phase",
    updatedAt: "2024-02-09T13:15:00Z",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: 8,
    name: "Educational Platform",
    client: "Learn Forward",
    email: "contact@learnforward.edu",
    phone: "+1 (555) 890-1234",
    status: "Completed",
    progress: 100,
    accountManager: "Robert Taylor",
    points: 1800,
    lastUpdate: "Platform launched successfully",
    updatedAt: "2024-02-08T10:00:00Z",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: 9,
    name: "Cybersecurity Solutions",
    client: "SecureNet",
    email: "projects@securenet.com",
    phone: "+1 (555) 901-2345",
    status: "Active",
    progress: 40,
    accountManager: "Sophie Anderson",
    points: 2500,
    lastUpdate: "Security audit in progress",
    updatedAt: "2024-02-07T15:30:00Z",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  {
    id: 10,
    name: "AI Analytics Tool",
    client: "DataMinds",
    email: "hello@dataminds.ai",
    phone: "+1 (555) 012-3456",
    status: "Pending",
    progress: 25,
    accountManager: "Alex Morgan",
    points: 3000,
    lastUpdate: "Requirements gathering",
    updatedAt: "2024-02-06T09:45:00Z",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  }
];

const AdminProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = demoProjects.filter(project => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      project.client.toLowerCase().includes(searchLower) ||
      project.accountManager.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all ongoing projects
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search projects..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AdminProjectsTable projects={filteredProjects} />
    </div>
  );
};

export default AdminProjects;