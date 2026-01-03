import { SignupForm } from "@/components/forms/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new Intern Quest account to start exploring internship opportunities.",
};

export default function SignupPage() {
  return <SignupForm />;
}
