import { LoginForm } from "@/components/forms/login-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
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
  const { callbackUrl } = (await props.searchParams) as {
    callbackUrl?: string;
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
