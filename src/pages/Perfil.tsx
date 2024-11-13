const Perfil = () => {
  return (
    <div className="space-y-6">
      <h1>Meu Perfil</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;