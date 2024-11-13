const Produtos = () => {
  return (
    <div className="space-y-6">
      <h1>Meus Produtos</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Produtos Selecionados</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Gerencie seus produtos selecionados e amostras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;