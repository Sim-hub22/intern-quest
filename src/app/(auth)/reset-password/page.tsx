import { SetNewPasswordForm } from "@/components/forms/set-new-password-form";
import { VerifyResetOTPForm } from "@/components/forms/verify-reset-otp-form";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    email?: string;
    verified?: string;
    otp?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;
  const verified = params.verified === "true";
  const otp = params.otp;

  if (!email) {
    redirect("/forgot-password");
  }

  // If OTP is verified, show password reset form
  if (verified && otp) {
    return <SetNewPasswordForm email={email} otp={otp} />;
  }

  // Otherwise, show OTP verification form
  return <VerifyResetOTPForm email={email} />;
}
