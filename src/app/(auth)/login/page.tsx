import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Intern Quest account to access internship opportunities.",
};

export default function LoginPage() {
  return <LoginForm />;
}
