import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProjectWithProfile {
  id: string;
  name: string;
  status: string;
  points: number;
  points_used: number;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

export const ProjectsManagement = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: projects, isLoading } = useQuery<ProjectWithProfile[]>({
    queryKey: ['admin-projects', search],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  const handlePointsChange = async (projectId: string, change: number) => {
    const project = projects?.find(p => p.id === projectId);
    if (!project) return;

    const newPoints = (project.points || 0) + change;
    if (newPoints < 0) return;

    const { error } = await supabase
      .from('projects')
      .update({ points: newPoints })
      .eq('id', projectId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project points. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Project points updated successfully.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Project Management</h1>
        <p className="text-gray-500">Manage and monitor all projects</p>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {project.profiles?.first_name} {project.profiles?.last_name}
                  <div className="text-sm text-gray-500">{project.profiles?.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full max-w-xs">
                    <Progress value={((project.points_used || 0) / (project.points || 1000)) * 100} />
                  </div>
                </TableCell>
                <TableCell>{project.points}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePointsChange(project.id, -100)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePointsChange(project.id, 100)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};