"use client";

import { Card } from "@/components/ui/card";
import { OtpForm } from "@/components/forms/otp-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface VerifyResetOTPFormProps extends Omit<React.ComponentProps<typeof Card>, "onSubmit"> {
  email: string;
}

export function VerifyResetOTPForm({
  email,
  ...props
}: VerifyResetOTPFormProps) {
  const router = useRouter();
  const [isResending, startTransition] = useTransition();

  const handleSubmit = async (values: { email: string; otp: string }) => {
    await authClient.emailOtp.checkVerificationOtp(
      {
        email: values.email,
        otp: values.otp,
        type: "forget-password",
      },
      {
        onSuccess: () => {
          // Navigate to the reset page with verified params
          const params = new URLSearchParams();
          params.set("email", email);
          params.set("verified", "true");
          params.set("otp", values.otp);
          router.push(`/forgot-password/reset?${params.toString()}`);
        },
        onError: ({ error }: { error?: { message?: string } }) => {
          toast.error(
            error?.message || "Invalid or expired code. Please try again.",
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
          type: "forget-password",
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
      title="Verify your identity"
      description={`We sent a 6-digit code to ${email}. Enter it below to continue.`}
      onSubmit={handleSubmit}
      onResend={handleResend}
      isResending={isResending}
      resendCooldownSeconds={60}
      {...props}
    />
  );
}
