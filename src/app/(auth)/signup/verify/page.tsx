import { VerifyEmailOTPForm } from "@/components/forms/verify-email-otp-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
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
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <VerifyEmailOTPForm email={email} />
    </div>
  );
}
