import { useEffect } from 'react';
import { Product, ProductImage } from "@/types/product";
import { trackEvent } from "@/lib/analytics";

interface ProductAnalyticsProps {
  product: Product;
  productImages?: ProductImage[];
}

export const ProductAnalytics = ({ product, productImages }: ProductAnalyticsProps) => {
  useEffect(() => {
    if (product) {
      trackEvent("Product Viewed", {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        price_range: {
          from: product.from_price,
          srp: product.srp
        },
        profit_margin: product.srp - product.from_price,
        is_new: product.is_new,
        is_tiktok: product.is_tiktok,
        description: product.description,
        main_image_url: product.image_url,
        gallery_images: productImages?.map(img => ({
          url: img.image_url,
          is_primary: img.is_primary,
          position: img.position
        })),
        created_at: product.created_at,
        updated_at: product.updated_at,
        total_images: productImages?.length || 0
      });
    }
  }, [product, productImages]);

  return null;
};