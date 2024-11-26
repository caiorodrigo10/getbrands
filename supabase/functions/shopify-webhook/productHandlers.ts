import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleProductUpdate(shopifyProduct: any) {
  console.log('Processando atualização do produto:', { 
    productId: shopifyProduct.id,
    title: shopifyProduct.title
  });

  try {
    const variant = shopifyProduct.variants[0];
    const images = shopifyProduct.images.map((img: any) => ({
      image_url: img.src,
      position: img.position,
      is_primary: img.position === 1
    }));

    console.log('Detalhes do produto:', {
      variant,
      images,
      price: variant.price
    });

    const { data: product, error: productError } = await supabase
      .from('products')
      .upsert({
        name: shopifyProduct.title,
        description: shopifyProduct.body_html,
        category: shopifyProduct.product_type || 'Uncategorized',
        from_price: parseFloat(variant.price),
        srp: parseFloat(variant.compare_at_price || variant.price),
        image_url: shopifyProduct.images[0]?.src,
        is_new: shopifyProduct.tags.includes('new'),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (productError) throw productError;

    console.log('Produto atualizado com sucesso:', { productId: product.id });

    await updateProductMapping(product.id, shopifyProduct, variant);
    await updateProductImages(product.id, images);

    return product;
  } catch (error) {
    console.error('Erro em handleProductUpdate:', error);
    throw error;
  }
}

export async function handleProductDelete(shopifyProduct: any) {
  console.log('Processando exclusão do produto:', { productId: shopifyProduct.id });

  try {
    const { data: mapping, error: fetchError } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    if (fetchError) throw fetchError;

    if (mapping) {
      await deleteProductData(mapping.product_id);
      console.log('Produto excluído com sucesso');
    }
  } catch (error) {
    console.error('Erro em handleProductDelete:', error);
    throw error;
  }
}

async function updateProductMapping(productId: string, shopifyProduct: any, variant: any) {
  const { error: mappingError } = await supabase
    .from('shopify_products')
    .upsert({
      product_id: productId,
      shopify_id: shopifyProduct.id.toString(),
      shopify_variant_id: variant.id.toString(),
      last_synced_at: new Date().toISOString()
    });

  if (mappingError) throw mappingError;
  console.log('Mapeamento do produto atualizado');
}

async function updateProductImages(productId: string, images: any[]) {
  if (images.length > 0) {
    const { error: imagesError } = await supabase
      .from('product_images')
      .upsert(
        images.map(img => ({
          product_id: productId,
          ...img
        }))
      );

    if (imagesError) throw imagesError;
    console.log('Imagens do produto atualizadas:', { imageCount: images.length });
  }
}

async function deleteProductData(productId: string) {
  const { error: imagesError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (imagesError) throw imagesError;

  const { error: productError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (productError) throw productError;

  const { error: mappingError } = await supabase
    .from('shopify_products')
    .delete()
    .eq('product_id', productId);

  if (mappingError) throw mappingError;
}