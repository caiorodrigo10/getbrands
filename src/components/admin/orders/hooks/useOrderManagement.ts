import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOrderManagement = (orders: any[], totalOrders: number) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const { error } = await supabase
        .from('sample_requests')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

      toast({
        title: "Status atualizado",
        description: `Status do pedido alterado para ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Falha ao atualizar status do pedido",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return {
    expandedOrderId,
    updatingOrderId,
    toggleOrderExpansion,
    handleStatusChange,
  };
};