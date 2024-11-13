const Projetos = () => {
  return (
    <div className="space-y-6">
      <h1>Meus Projetos</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Projetos em Andamento</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Visualize e gerencie seus projetos ativos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projetos;