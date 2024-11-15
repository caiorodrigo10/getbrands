import { NavigationMenu } from "@/components/NavigationMenu";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <NavigationMenu />
    <main className="p-4 md:p-8 overflow-x-hidden">
      <div className="container mx-auto max-w-[1400px]">{children}</div>
    </main>
  </div>
);