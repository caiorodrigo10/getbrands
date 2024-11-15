import Sidebar from "@/components/Sidebar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  </div>
);