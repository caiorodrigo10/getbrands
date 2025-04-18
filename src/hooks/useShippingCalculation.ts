import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ShippingRate {
  country: string;
  min_items: number;
  max_items: number | null;
  base_rate: number;
  additional_rate_per_item: number | null;
}

export const useShippingCalculation = (country: string, totalItems: number) => {
  return useQuery({
    queryKey: ["shipping", country, totalItems],
    queryFn: async () => {
      const { data: rates, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .eq("country", country)
        .order("min_items", { ascending: true });

      if (error) throw error;

      // Find the applicable rate based on the number of items
      const applicableRate = rates?.find(
        (rate: ShippingRate) =>
          totalItems >= rate.min_items &&
          (rate.max_items === null || totalItems <= rate.max_items)
      );

      if (!applicableRate) return 10.00; // Default base rate for US

      let shippingCost = applicableRate.base_rate;

      // For additional items, add the additional cost per item if applicable
      if (applicableRate.additional_rate_per_item && totalItems > applicableRate.min_items) {
        const additionalItems = totalItems - applicableRate.min_items;
        shippingCost += additionalItems * applicableRate.additional_rate_per_item;
      }

      return shippingCost;
    },
    enabled: Boolean(country && totalItems > 0),
  });
};