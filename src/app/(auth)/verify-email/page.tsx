import { VerifyEmailOTPForm } from "@/components/forms/verify-email-otp-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Verify your email address to complete your Intern Quest account setup.",
};

async function VerifyEmailContent(props: PageProps<"/verify-email">) {
  const { email } = (await props.searchParams) as { email?: string };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/signup");
  }

  return <VerifyEmailOTPForm email={email} />;
}

export default function VerifyEmailPage(props: PageProps<"/verify-email">) {
  return (
    <Suspense>
      <VerifyEmailContent {...props} />
    </Suspense>
  );
}
