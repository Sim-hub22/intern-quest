import { SignupForm } from "@/components/forms/signup-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new Intern Quest account to start exploring internship opportunities.",
};

export default function SignupPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <Logo />
      </Link>
      <SignupForm />
    </div>
  );
}
