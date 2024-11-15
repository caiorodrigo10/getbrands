import { Sidebar } from "@/components/Sidebar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 ml-64 p-4 md:p-8 overflow-x-hidden">
      <div className="container mx-auto max-w-[1400px]">{children}</div>
    </main>
  </div>
);