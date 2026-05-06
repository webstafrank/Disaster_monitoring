import type { ReactNode } from "react";
import { Footer } from "./_components/footer";
import { SideNav } from "./_components/side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="dashboard-shell min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <SideNav />
        </aside>
        <main className="glass-panel rise-in flex min-h-full flex-col rounded-[1.75rem] p-5 md:p-8">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
