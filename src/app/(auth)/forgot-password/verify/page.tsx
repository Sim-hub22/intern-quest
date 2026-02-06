import { VerifyResetOTPForm } from "@/components/forms/verify-reset-otp-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Reset Code",
  description:
    "Verify the reset code to continue resetting your Intern Quest password.",
};

export default function Page(props: PageProps<"/forgot-password/verify">) {
  return (
    <Suspense fallback={null}>
      <VerifyResetPage {...props} />
    </Suspense>
  );
}

async function VerifyResetPage(props: PageProps<"/forgot-password/verify">) {
  const { email } = (await props.searchParams) as { email?: string };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    redirect("/forgot-password");
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <VerifyResetOTPForm email={email} />
    </div>
  );
}
