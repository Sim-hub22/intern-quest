"use client";

import { OtpForm } from "@/components/forms/otp-form";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface VerifyEmailOTPFormProps extends Omit<
  React.ComponentProps<typeof Card>,
  "onSubmit"
> {
  email: string;
}

export function VerifyEmailOTPForm({
  email,
  ...props
}: VerifyEmailOTPFormProps) {
  const router = useRouter();
  const [isResending, startTransition] = useTransition();

  const handleSubmit = async (values: { email: string; otp: string }) => {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: values.email,
      otp: values.otp,
    });

    if (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  const handleResend = (onSuccess?: () => void) =>
    startTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        console.error(error);
        toast.error(error.message || "Something went wrong. Please try again.");
        return;
      }

      toast.success("New code sent!", {
        description: `We've sent a new code to ${email}`,
      });
      onSuccess?.();
    });

  return (
    <OtpForm
      email={email}
      title="Please verify your email"
      description={`We've sent a 6-digit code to ${email}. Enter it below to continue.`}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isResending={isResending}
      resendCooldownSeconds={60}
      {...props}
    />
  );
}
