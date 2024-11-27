import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logger } from './logger.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const handleProductUpdate = async (shopifyProduct: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  logger.info('Processing product update', { productId: shopifyProduct.id });

  try {
    const variant = shopifyProduct.variants[0];
    const images = shopifyProduct.images?.map((img: any) => ({
      image_url: img.src,
      position: img.position,
      is_primary: img.position === 1
    })) || [];

    if (!variant) {
      throw new Error('Product has no primary variant');
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    let productId = existingProduct?.product_id;

    if (!productId) {
      // Create new product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: shopifyProduct.title,
          description: shopifyProduct.body_html,
          category: shopifyProduct.product_type || 'Uncategorized',
          from_price: parseFloat(variant.price),
          srp: parseFloat(variant.compare_at_price || variant.price),
          image_url: shopifyProduct.images[0]?.src,
          is_new: shopifyProduct.tags?.includes('new') || false,
        })
        .select()
        .single();

      if (productError) throw productError;
      productId = newProduct.id;
    } else {
      // Update existing product
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: shopifyProduct.title,
          description: shopifyProduct.body_html,
          category: shopifyProduct.product_type || 'Uncategorized',
          from_price: parseFloat(variant.price),
          srp: parseFloat(variant.compare_at_price || variant.price),
          image_url: shopifyProduct.images[0]?.src,
          is_new: shopifyProduct.tags?.includes('new') || false,
        })
        .eq('id', productId);

      if (updateError) throw updateError;
    }

    // Update Shopify mapping
    await supabase
      .from('shopify_products')
      .upsert({
        product_id: productId,
        shopify_id: shopifyProduct.id.toString(),
        shopify_variant_id: variant.id.toString(),
        last_synced_at: new Date().toISOString()
      });

    // Update images
    if (images.length > 0) {
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      await supabase
        .from('product_images')
        .insert(
          images.map(img => ({
            product_id: productId,
            ...img
          }))
        );
    }

    logger.webhook('products/update', 'processed', { productId });
    return { productId, status: 'success' };
  } catch (error) {
    logger.error('Failed to process product update', error);
    throw error;
  }
};

export const handleProductDelete = async (shopifyProduct: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  logger.info('Processing product deletion', { productId: shopifyProduct.id });

  try {
    const { data: mapping } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    if (mapping) {
      await deleteProductData(supabase, mapping.product_id);
      logger.webhook('products/delete', 'processed', { productId: mapping.product_id });
      return { status: 'success', deletedProductId: mapping.product_id };
    }
    
    logger.info('Product not found for deletion');
    return { status: 'not_found' };
  } catch (error) {
    logger.error('Failed to process product deletion', error);
    throw error;
  }
};

const deleteProductData = async (supabase: any, productId: string) => {
  await supabase.from('product_images').delete().eq('product_id', productId);
  await supabase.from('products').delete().eq('id', productId);
  await supabase.from('shopify_products').delete().eq('product_id', productId);
};