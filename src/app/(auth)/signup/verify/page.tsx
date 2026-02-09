import { AuthShell } from "@/components/auth-shell";
import { VerifyEmailOTPForm } from "@/components/forms/verify-email-otp-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to complete your Intern Quest account setup.",
};

export default function Page(props: PageProps<"/signup/verify">) {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage {...props} />
    </Suspense>
  );
}

async function VerifyEmailPage(props: PageProps<"/signup/verify">) {
  const { email } = (await props.searchParams) as { email?: string };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/signup");
  }

  return (
    <AuthShell>
      <VerifyEmailOTPForm email={email} />
    </AuthShell>
  );
}
