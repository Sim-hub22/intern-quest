import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your password to regain access to your Intern Quest account.",
};

export default function Page(props: PageProps<"/forgot-password/reset">) {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage {...props} />
    </Suspense>
  );
}

async function ResetPasswordPage(props: PageProps<"/forgot-password/reset">) {
  const { email, otp } = (await props.searchParams) as {
    email?: string;
    otp?: string;
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !otp || !emailRegex.test(email)) {
    redirect("/forgot-password");
  }
  return (
    <AuthShell>
      <ResetPasswordForm email={email} otp={otp} />
    </AuthShell>
  );
}
