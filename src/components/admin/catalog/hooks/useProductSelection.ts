import { useState } from "react";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductSelection = (products: Product[], totalProducts: number) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      setSelectAllPages(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
      setSelectAllPages(false);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDuplicateSelected = async () => {
    try {
      const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
      
      for (const product of selectedProductsData) {
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: `${product.name} (Copy)`,
            category: product.category,
            description: product.description,
            from_price: product.from_price,
            srp: product.srp,
            is_new: product.is_new,
            is_tiktok: product.is_tiktok,
            image_url: product.image_url
          })
          .select()
          .single();

        if (productError) throw productError;

        const { data: productImages } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', product.id);

        if (productImages) {
          for (const image of productImages) {
            await supabase
              .from('product_images')
              .insert({
                product_id: newProduct.id,
                image_url: image.image_url,
                position: image.position,
                is_primary: image.is_primary
              });
          }
        }
      }

      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ['admin-catalog'] });

      toast({
        title: "Success",
        description: `Successfully duplicated ${selectedProducts.length} product(s)`,
      });
    } catch (error) {
      console.error('Error duplicating products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate products. Please try again.",
      });
    }
  };

  return {
    selectedProducts,
    selectAllPages,
    handleSelectProduct,
    handleSelectAll,
    handleSelectAllPages,
    handleDuplicateSelected,
    setSelectedProducts,
  };
};