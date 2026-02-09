import { AuthShell } from "@/components/auth-shell";
import { VerifyResetOTPForm } from "@/components/forms/verify-reset-otp-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Code",
  description:
    "Verify the code sent to your email to reset your password.",
};

interface VerifyResetPasswordPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default function Page({
  searchParams,
}: PageProps<"/forgot-password/verify">) {
  return (
    <Suspense fallback={null}>
      <VerifyResetPasswordPage searchParams={searchParams} />
    </Suspense>
  );
}

async function VerifyResetPasswordPage({
  searchParams,
}: VerifyResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell>
      <VerifyResetOTPForm email={email} />
    </AuthShell>
  );
}
