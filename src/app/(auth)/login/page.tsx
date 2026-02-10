import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Intern Quest account to access internship opportunities.",
};

export default function Page(props: PageProps<"/login">) {
  return (
    <Suspense fallback={null}>
      <LoginPage {...props} />
    </Suspense>
  );
}

async function LoginPage(props: PageProps<"/login">) {
  const params = (await props.searchParams) as { callbackUrl?: string };
  const callbackUrl = params.callbackUrl || "/dashboard";

  return (
    <AuthShell>
      <LoginForm callbackUrl={callbackUrl} />
    </AuthShell>
  );
}
