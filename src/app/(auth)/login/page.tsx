import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/modules/auth/components/login-form";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your InternQuest account",
};

export default function LoginPage() {
  return (
    <div className="max-w-md w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/">
          <Logo />
        </Link>
        <h1 className="text-foreground mb-2">Sign In to Your Account</h1>
        <p className="text-muted-foreground">
          Welcome back! Please enter your details
        </p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Button
          variant="link"
          className="text-primary hover:text-primary/80 p-0"
          asChild
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </p>
    </div>
  );
}
