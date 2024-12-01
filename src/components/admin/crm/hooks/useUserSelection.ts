import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const useUserSelection = (users: any[], onUserUpdated: () => void, totalUsers: number) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
      setSelectAllPages(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
      setSelectAllPages(false);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedUsers.length} user(s)`,
      });

      setSelectedUsers([]);
      setSelectAllPages(false);
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ["crm-users"] });
      onUserUpdated();
    } catch (error: any) {
      console.error('Error deleting users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete users. Please try again.",
      });
    }
  };

  return {
    selectedUsers,
    selectAllPages,
    showDeleteDialog,
    setShowDeleteDialog,
    handleSelectUser,
    handleSelectAll,
    handleSelectAllPages,
    handleDeleteSelected
  };
};