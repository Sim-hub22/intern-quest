import { AuthShell } from "@/components/auth-shell";
import { VerifyResetOTPForm } from "@/components/forms/verify-reset-otp-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Code",
  description: "Verify the code sent to your email to reset your password.",
};

export default function Page(props: PageProps<"/forgot-password/verify">) {
  return (
    <Suspense fallback={null}>
      <VerifyResetPasswordPage {...props} />
    </Suspense>
  );
}

async function VerifyResetPasswordPage(
  props: PageProps<"/forgot-password/verify">,
) {
  const { email } = (await props.searchParams) as { email?: string };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell>
      <VerifyResetOTPForm email={email} />
    </AuthShell>
  );
}
