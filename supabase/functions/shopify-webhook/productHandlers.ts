import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleProductUpdate(shopifyProduct: any) {
  console.log('Processando atualização do produto:', { 
    productId: shopifyProduct.id,
    title: shopifyProduct.title,
    variants: shopifyProduct.variants?.length
  });

  try {
    const variant = shopifyProduct.variants[0];
    const images = shopifyProduct.images?.map((img: any) => ({
      image_url: img.src,
      position: img.position,
      is_primary: img.position === 1
    })) || [];

    console.log('Detalhes do produto:', {
      variant,
      imagesCount: images.length,
      price: variant?.price
    });

    if (!variant) {
      throw new Error('Produto sem variante principal');
    }

    // Primeiro procura se o produto já existe
    const { data: existingProduct } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    let productId = existingProduct?.product_id;

    // Se não existe, cria um novo produto
    if (!productId) {
      console.log('Criando novo produto...');
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

      if (productError) {
        console.error('Erro ao criar produto:', productError);
        throw productError;
      }

      productId = newProduct.id;
      console.log('Novo produto criado:', { productId });
    } else {
      console.log('Atualizando produto existente:', { productId });
      // Atualiza o produto existente
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

      if (updateError) {
        console.error('Erro ao atualizar produto:', updateError);
        throw updateError;
      }
    }

    // Atualiza ou cria o mapeamento Shopify
    const { error: mappingError } = await supabase
      .from('shopify_products')
      .upsert({
        product_id: productId,
        shopify_id: shopifyProduct.id.toString(),
        shopify_variant_id: variant.id.toString(),
        last_synced_at: new Date().toISOString()
      });

    if (mappingError) {
      console.error('Erro ao atualizar mapeamento:', mappingError);
      throw mappingError;
    }

    // Atualiza as imagens
    if (images.length > 0) {
      console.log('Atualizando imagens do produto...');
      const { error: deleteImagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      if (deleteImagesError) {
        console.error('Erro ao deletar imagens antigas:', deleteImagesError);
        throw deleteImagesError;
      }

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(
          images.map(img => ({
            product_id: productId,
            ...img
          }))
        );

      if (imagesError) {
        console.error('Erro ao inserir novas imagens:', imagesError);
        throw imagesError;
      }
      console.log('Imagens atualizadas com sucesso');
    }

    return { productId, status: 'success' };
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

    if (fetchError) {
      console.error('Erro ao buscar mapeamento:', fetchError);
      throw fetchError;
    }

    if (mapping) {
      await deleteProductData(mapping.product_id);
      console.log('Produto excluído com sucesso');
      return { status: 'success', deletedProductId: mapping.product_id };
    } else {
      console.log('Produto não encontrado para exclusão');
      return { status: 'not_found' };
    }
  } catch (error) {
    console.error('Erro em handleProductDelete:', error);
    throw error;
  }
}

async function deleteProductData(productId: string) {
  console.log('Iniciando exclusão de dados do produto:', productId);

  const { error: imagesError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (imagesError) {
    console.error('Erro ao deletar imagens:', imagesError);
    throw imagesError;
  }

  const { error: productError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (productError) {
    console.error('Erro ao deletar produto:', productError);
    throw productError;
  }

  const { error: mappingError } = await supabase
    .from('shopify_products')
    .delete()
    .eq('product_id', productId);

  if (mappingError) {
    console.error('Erro ao deletar mapeamento:', mappingError);
    throw mappingError;
  }

  console.log('Dados do produto excluídos com sucesso');
}