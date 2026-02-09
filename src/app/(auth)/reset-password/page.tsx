import { AuthShell } from "@/components/auth-shell";
import { SetNewPasswordForm } from "@/components/forms/set-new-password-form";
import { VerifyResetOTPForm } from "@/components/forms/verify-reset-otp-form";
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

export default function Page({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;
  const verified = params.verified === "true";
  const otp = params.otp;

  if (!email) {
    redirect("/forgot-password");
  }

  // If OTP is verified, show password reset form
  if (verified && otp) {
    return (
      <AuthShell>
        <SetNewPasswordForm email={email} otp={otp} />
      </AuthShell>
    );
  }

  // Otherwise, show OTP verification form
  return (
    <AuthShell>
      <VerifyResetOTPForm email={email} />
    </AuthShell>
  );
}
