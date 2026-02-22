import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<div className="h-16" />}>
        <Navigation />
      </Suspense>
      {children}
      <Footer />
    </main>
  );
}
