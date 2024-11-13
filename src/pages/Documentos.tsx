const Documentos = () => {
  return (
    <div className="space-y-6">
      <h1>Documentos</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Meus Documentos</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Acesse e gerencie seus documentos importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;