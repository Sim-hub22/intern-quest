import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}
