import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your password to regain access to your Intern Quest account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
