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
    await authClient.emailOtp.verifyEmail(
      {
        email: values.email,
        otp: values.otp,
      },
      {
        onSuccess: async () => {
          router.push("/");
        },
        onError: ({ error }: { error?: { message?: string } }) => {
          toast.error(
            error?.message || "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  const handleResend = (onSuccess?: () => void) =>
    startTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: "email-verification",
        },
        {
          onSuccess: () => {
            toast.success("New code sent!", {
              description: `We've sent a new code to ${email}`,
            });
            onSuccess?.();
          },
          onError: ({ error }: { error?: { message?: string } }) => {
            toast.error(
              error?.message || "Something went wrong. Please try again.",
            );
          },
        },
      );
    });

  return (
    <OtpForm
      email={email}
      title="Enter verification code"
      description={`We sent a 6-digit code to ${email}. Enter it below to continue.`}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isResending={isResending}
      resendCooldownSeconds={60}
      {...props}
    />
  );
}
