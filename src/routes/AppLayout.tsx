import { NavigationMenu } from "@/components/NavigationMenu";

export const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <NavigationMenu />
    <main className="md:pl-64 w-full">
      <div className="max-w-[1000px] mx-auto px-4 py-6 mt-16 md:mt-0">
        {children}
      </div>
    </main>
  </div>
);