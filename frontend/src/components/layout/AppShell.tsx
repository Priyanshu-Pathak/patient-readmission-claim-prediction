"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "../ui/Container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/how-it-works", label: "HOW IT WORKS" },
  { href: "/predict", label: "PREDICT" },
  { href: "/analytics", label: "ANALYTICS" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Ref for the nav container to calculate pill position
  const navRef = useRef<HTMLElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    // Update pill position based on active route
    if (!navRef.current) return;
    
    const activeLink = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (activeLink) {
      setPillStyle({
        left: activeLink.offsetLeft,
        width: activeLink.offsetWidth,
        opacity: 1
      });
    } else {
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border/40">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-sm leading-none">+</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">AdmitGuard Intelligence</span>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center gap-2 relative h-full">
            {/* Sliding Underline Indicator */}
            <div 
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out z-0"
              style={{
                left: `${pillStyle.left}px`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />
            
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive}
                  className={cn(
                    "relative z-10 px-3 py-5 text-xs font-bold tracking-wider transition-colors",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex h-8 w-8 rounded-full border border-border items-center justify-center text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur shadow-lg absolute w-full left-0 animate-in slide-in-from-top-2 duration-200">
            <Container className="py-4 space-y-1 flex flex-col">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </Container>
          </div>
        )}
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
