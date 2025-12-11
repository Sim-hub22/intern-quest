import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grow bg-muted flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </div>
  );
}
