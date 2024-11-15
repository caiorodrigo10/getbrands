import { NavigationMenu } from "@/components/NavigationMenu";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <NavigationMenu />
    <main className="w-full px-4 py-6">
      <div className="mx-auto max-w-[1000px]">
        {children}
      </div>
    </main>
  </div>
);