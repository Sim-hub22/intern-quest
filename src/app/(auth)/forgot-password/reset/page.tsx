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

interface ResetPasswordPageProps {
  searchParams: Promise<{
    email?: string;
    verified?: string;
    otp?: string;
  }>;
}

export default function Page({
  searchParams,
}: PageProps<"/forgot-password/reset">) {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;
  const verified = params.verified === "true";
  const otp = params.otp;

  if (!email || !verified || !otp) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell>
      <ResetPasswordForm email={email} otp={otp} />
    </AuthShell>
  );
}
