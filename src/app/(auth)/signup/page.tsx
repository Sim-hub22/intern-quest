import { Button } from "@/components/ui/button";
import { SignupForm } from "@/modules/auth/components/signup-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-muted flex pt-14">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  IQ
                </span>
              </div>
              <span className="text-foreground text-xl">InternQuest</span>
            </Link>
            <h1 className="text-foreground mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Start your journey to the perfect internship
            </p>
          </div>

          {/* Sign Up Form */}
          <SignupForm />

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button className="p-0" variant="link">
              <Link
                href="/login"
                className="text-primary hover:text-primary/80"
              >
                Sign In
              </Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
