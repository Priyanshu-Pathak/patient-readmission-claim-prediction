import React from "react";
import { Container } from "../ui/Container";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo placeholder */}
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-primary font-bold text-xl leading-none">+</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">AdmitGuard<span className="text-primary">.</span></span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Patients</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Batch Upload</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-muted border border-border" />
          </div>
        </Container>
      </header>
      <main className="flex-1 py-8">
        {children}
      </main>
      <footer className="border-t border-border/40 py-6 md:py-0">
        <Container className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground leading-loose text-center md:text-left">
            AdmitGuard Intelligence &copy; {new Date().getFullYear()}. For educational and analytical purposes only.
          </p>
        </Container>
      </footer>
    </div>
  );
}
