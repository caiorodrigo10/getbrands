const Projetos = () => {
  return (
    <div className="space-y-6">
      <h1>My Projects</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Ongoing Projects</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              View and manage your active projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projetos;