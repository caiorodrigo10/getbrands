import { supabaseUtils } from './admin';

// Exemplo de como usar as funções do supabaseUtils

export const examples = {
  // Exemplo: Criar uma tabela de produtos
  async createProductsTable() {
    await supabaseUtils.createTable('products', {
      id: 'uuid primary key default uuid_generate_v4()',
      name: 'text not null',
      description: 'text',
      price: 'decimal not null',
      category: 'text',
      stock: 'integer default 0',
      created_at: 'timestamp with time zone default now()',
      updated_at: 'timestamp with time zone default now()'
    });
  },

  // Exemplo: Adicionar uma nova coluna à tabela de produtos
  async addProductColumn() {
    await supabaseUtils.addColumn('products', 'is_featured', 'boolean default false');
  },

  // Exemplo: Inserir um produto
  async insertProduct() {
    const product = {
      name: 'Exemplo de Produto',
      description: 'Descrição do produto de exemplo',
      price: 99.99,
      category: 'Categoria Teste',
      stock: 10
    };

    const result = await supabaseUtils.insertData('products', product);
    return result;
  },

  // Exemplo: Listar todas as tabelas
  async listAllTables() {
    const tables = await supabaseUtils.listTables();
    console.log('Tabelas existentes:', tables);
    return tables;
  },

  // Exemplo: Listar colunas de uma tabela
  async listProductColumns() {
    const columns = await supabaseUtils.listColumns('products');
    console.log('Colunas da tabela products:', columns);
    return columns;
  },

  // Exemplo: Atualizar um produto
  async updateProduct(productId: string) {
    const updates = {
      price: 149.99,
      stock: 20
    };

    const result = await supabaseUtils.updateData('products', { id: productId }, updates);
    return result;
  },

  // Exemplo: Deletar um produto
  async deleteProduct(productId: string) {
    const result = await supabaseUtils.deleteData('products', { id: productId });
    return result;
  }
};
