const Documentos = () => {
  return (
    <div className="space-y-6">
      <h1>Documents</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">My Documents</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Access and manage your important documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentos;