import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { logger } from './logger.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const shopifyDomain = Deno.env.get('SHOPIFY_SHOP_DOMAIN')!;
const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;

// Função para buscar o custo do inventory item
async function getInventoryItemCost(inventoryItemId: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://${shopifyDomain}/admin/api/2023-10/inventory_items/${inventoryItemId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch inventory item: ${response.statusText}`);
    }

    const data = await response.json();
    logger.info('Inventory item data:', {
      inventoryItemId,
      cost: data.inventory_item?.cost,
      unit_cost: data.inventory_item?.unit_cost,
      raw: data.inventory_item
    });
    
    // Priorizar o cost total, depois unit_cost
    const finalCost = data.inventory_item?.cost || data.inventory_item?.unit_cost;
    return finalCost ? parseFloat(finalCost) : null;
  } catch (error) {
    logger.error('Error fetching inventory item cost:', error);
    return null;
  }
}

export const handleProductUpdate = async (shopifyProduct: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  logger.info('V2: Processing product update', { 
    productId: shopifyProduct.id,
    title: shopifyProduct.title 
  });

  try {
    const variant = shopifyProduct.variants[0];
    
    if (!variant) {
      throw new Error('Product has no primary variant');
    }

    // Log variant data
    logger.info('Variant data:', {
      variantId: variant.id,
      inventoryItemId: variant.inventory_item_id,
      price: variant.price,
      compareAtPrice: variant.compare_at_price
    });

    // Buscar o custo do inventory item
    let cost = null;
    if (variant.inventory_item_id) {
      cost = await getInventoryItemCost(variant.inventory_item_id);
      logger.info('Retrieved cost from inventory item:', { 
        inventoryItemId: variant.inventory_item_id,
        cost 
      });
    }

    // Se não encontrar o custo, usar o preço como fallback
    if (cost === null) {
      cost = parseFloat(variant.price);
      logger.info('Using variant price as cost fallback:', { cost });
    }

    // Garantir que o custo é um número válido
    if (isNaN(cost) || cost <= 0) {
      logger.warn('Invalid cost detected, using variant price:', {
        originalCost: cost,
        variantPrice: variant.price
      });
      cost = parseFloat(variant.price);
    }

    const images = shopifyProduct.images?.map((img: any) => ({
      image_url: img.src,
      position: img.position,
      is_primary: img.position === 1
    })) || [];

    // Verificar se o produto existe
    const { data: existingProduct } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    let productId = existingProduct?.product_id;

    const productData = {
      name: shopifyProduct.title,
      description: shopifyProduct.body_html,
      category: shopifyProduct.product_type || 'Uncategorized',
      from_price: cost,
      srp: parseFloat(variant.compare_at_price || variant.price),
      image_url: shopifyProduct.images[0]?.src,
      is_new: shopifyProduct.tags?.includes('new') || false,
      status: shopifyProduct.status === 'active' ? 'active' : 'inactive',
      updated_at: new Date().toISOString()
    };

    logger.info('Updating product with data:', {
      productId: productId || 'new',
      from_price: productData.from_price,
      srp: productData.srp
    });

    if (!productId) {
      // Criar novo produto
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          ...productData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (productError) {
        logger.error('Error creating product:', productError);
        throw productError;
      }
      productId = newProduct.id;
      logger.info('Created new product:', { 
        productId,
        from_price: newProduct.from_price 
      });
    } else {
      // Atualizar produto existente
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);

      if (updateError) {
        logger.error('Error updating product:', updateError);
        throw updateError;
      }
      logger.info('Updated existing product:', { 
        productId,
        from_price: productData.from_price 
      });
    }

    // Atualizar mapeamento Shopify
    const { error: mappingError } = await supabase
      .from('shopify_products')
      .upsert({
        product_id: productId,
        shopify_id: shopifyProduct.id.toString(),
        shopify_variant_id: variant.id.toString(),
        inventory_item_id: variant.inventory_item_id?.toString(),
        last_synced_at: new Date().toISOString(),
        last_cost_sync: cost
      });

    if (mappingError) {
      logger.error('Error updating shopify mapping:', mappingError);
      throw mappingError;
    }

    // Atualizar imagens
    if (images.length > 0) {
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (deleteImagesError) {
        logger.error('Error deleting old images:', deleteImagesError);
        throw deleteImagesError;
      }

      const { error: insertImagesError } = await supabase
        .from('product_images')
        .insert(
          images.map(img => ({
            product_id: productId,
            ...img
          }))
        );

      if (insertImagesError) {
        logger.error('Error inserting new images:', insertImagesError);
        throw insertImagesError;
      }
    }

    logger.webhook('products/update', 'processed', { 
      productId,
      title: shopifyProduct.title,
      from_price: cost
    });
    
    return { 
      productId, 
      status: 'success',
      from_price: cost,
      title: shopifyProduct.title
    };
  } catch (error) {
    logger.error('V2: Failed to process product update', error);
    throw error;
  }
};

export const handleProductDelete = async (shopifyProduct: any) => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  logger.info('V2: Processing product deletion', { productId: shopifyProduct.id });

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
    
    logger.info('V2: Product not found for deletion');
    return { status: 'not_found' };
  } catch (error) {
    logger.error('V2: Failed to process product deletion', error);
    throw error;
  }
};

const deleteProductData = async (supabase: any, productId: string) => {
  await supabase.from('product_images').delete().eq('product_id', productId);
  await supabase.from('products').delete().eq('id', productId);
  await supabase.from('shopify_products').delete().eq('product_id', productId);
};

export const syncAllProductsCost = async () => {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const shopifyDomain = Deno.env.get('SHOPIFY_SHOP_DOMAIN');
  const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  
  logger.info('Starting cost sync with config:', { 
    shopifyDomain: shopifyDomain ? 'present' : 'missing',
    shopifyToken: shopifyToken ? 'present' : 'missing'
  });

  if (!shopifyDomain || !shopifyToken) {
    throw new Error('Missing required Shopify configuration');
  }

  try {
    // Get all Shopify products with their variants
    logger.info('Fetching products from database...');
    const { data: shopifyProducts, error: shopifyError } = await supabase
      .from('shopify_products')
      .select('*')
      .order('created_at', { ascending: true });

    if (shopifyError) {
      logger.error('Failed to fetch products from database:', shopifyError);
      throw shopifyError;
    }

    if (!shopifyProducts?.length) {
      logger.info('No products found to sync');
      return { success: true, message: 'No products to sync' };
    }

    logger.info(`Found ${shopifyProducts.length} products to sync`);

    // Update each product
    for (const shopifyProduct of shopifyProducts) {
      try {
        logger.info(`Processing product ${shopifyProduct.shopify_id}`);
        
        // Get product data from Shopify API
        const productUrl = `https://${shopifyDomain}/admin/api/2023-10/products/${shopifyProduct.shopify_id}.json`;
        logger.info('Fetching product from Shopify:', { url: productUrl });
        
        const productResponse = await fetch(productUrl, {
          headers: {
            'X-Shopify-Access-Token': shopifyToken,
          },
        });

        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          throw new Error(`Failed to fetch product ${shopifyProduct.shopify_id}: ${productResponse.status} ${productResponse.statusText} - ${errorText}`);
        }

        const { product } = await productResponse.json();
        const variant = product.variants[0];

        if (!variant?.inventory_item_id) {
          logger.warn(`No inventory item ID found for product ${shopifyProduct.shopify_id}`);
          continue;
        }

        // Get inventory item data (which contains the cost)
        const inventoryUrl = `https://${shopifyDomain}/admin/api/2023-10/inventory_items/${variant.inventory_item_id}.json`;
        logger.info('Fetching inventory item:', { url: inventoryUrl });
        
        const inventoryResponse = await fetch(inventoryUrl, {
          headers: {
            'X-Shopify-Access-Token': shopifyToken,
          },
        });

        if (!inventoryResponse.ok) {
          const errorText = await inventoryResponse.text();
          throw new Error(`Failed to fetch inventory item: ${inventoryResponse.status} ${inventoryResponse.statusText} - ${errorText}`);
        }

        const { inventory_item } = await inventoryResponse.json();
        
        // Log the cost data for debugging
        logger.info(`Cost data for product ${shopifyProduct.shopify_id}:`, {
          cost: inventory_item.cost,
          unit_cost: inventory_item.unit_cost,
          variant_price: variant.price,
          inventory_item_id: variant.inventory_item_id
        });

        const cost = inventory_item.cost || inventory_item.unit_cost || variant.price;
        
        // Update product with cost
        const { error: updateError } = await supabase
          .from('products')
          .update({
            from_price: parseFloat(cost),
          })
          .eq('id', shopifyProduct.product_id);

        if (updateError) {
          logger.error(`Failed to update product ${shopifyProduct.shopify_id}:`, updateError);
          throw updateError;
        }
        
        logger.info(`Updated product ${shopifyProduct.shopify_id} with cost:`, { cost });
      } catch (error) {
        logger.error(`Failed to sync product ${shopifyProduct.shopify_id}:`, error);
      }
    }

    logger.info('Finished syncing all products');
    return { success: true, message: `Synced ${shopifyProducts.length} products` };
  } catch (error) {
    logger.error('Failed to sync products:', error);
    throw error;
  }
};
