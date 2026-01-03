import { Footer } from "@/components/footer";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </main>
  );
}
