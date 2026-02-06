import { SetNewPasswordForm } from "@/components/forms/set-new-password-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";
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

async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email;
  const verified = params.verified === "true";
  const otp = params.otp;

  if (!email) {
    redirect("/forgot-password");
  }

  if (!verified || !otp) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("email", email);
    redirect(`/forgot-password/verify?${urlSearchParams.toString()}`);
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <SetNewPasswordForm email={email} otp={otp} />
    </div>
  );
}
