import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your password to regain access to your Intern Quest account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <ForgotPasswordForm />
    </div>
  );
}
