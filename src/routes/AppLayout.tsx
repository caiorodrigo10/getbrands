import { NavigationMenu } from "@/components/NavigationMenu";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <NavigationMenu />
    <main className="w-full px-4 py-8">
      <div className="mx-auto max-w-[1100px]">
        {children}
      </div>
    </main>
  </div>
);