import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProjectCoverUpload } from "./ProjectCoverUpload";

interface ProjectEditModalProps {
  project: any;
  onUpdate: () => void;
}

export const ProjectEditModal = ({ project, onUpdate }: ProjectEditModalProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    user: {
      first_name: project.user?.first_name || '',
      last_name: project.user?.last_name || '',
      email: project.user?.email || '',
      phone: project.user?.phone || '',
      shipping_address_street: project.user?.shipping_address_street || '',
      shipping_address_city: project.user?.shipping_address_city || '',
      shipping_address_state: project.user?.shipping_address_state || '',
      shipping_address_zip: project.user?.shipping_address_zip || '',
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update project details
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', project.id);

      if (projectError) throw projectError;

      // Update user details
      const { error: userError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.user.first_name,
          last_name: formData.user.last_name,
          email: formData.user.email,
          phone: formData.user.phone,
          shipping_address_street: formData.user.shipping_address_street,
          shipping_address_city: formData.user.shipping_address_city,
          shipping_address_state: formData.user.shipping_address_state,
          shipping_address_zip: formData.user.shipping_address_zip,
        })
        .eq('id', project.user_id);

      if (userError) throw userError;

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Project</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Project Cover</Label>
              <div className="mt-2">
                <ProjectCoverUpload projectId={project.id} />
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.user.first_name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user: { ...prev.user, first_name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.user.last_name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user: { ...prev.user, last_name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.user.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user: { ...prev.user, email: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.user.phone}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user: { ...prev.user, phone: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Shipping Address</Label>
              <div className="grid gap-4">
                <Input
                  placeholder="Street Address"
                  value={formData.user.shipping_address_street}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    user: { ...prev.user, shipping_address_street: e.target.value }
                  }))}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    placeholder="City"
                    value={formData.user.shipping_address_city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, shipping_address_city: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="State"
                    value={formData.user.shipping_address_state}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, shipping_address_state: e.target.value }
                    }))}
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={formData.user.shipping_address_zip}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      user: { ...prev.user, shipping_address_zip: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};