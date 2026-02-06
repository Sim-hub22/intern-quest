export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
    </div>
  );
}
