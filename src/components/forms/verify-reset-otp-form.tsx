"use client";

import { OtpForm } from "@/components/forms/otp-form";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { otpSchema } from "@/validations/auth-schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import z from "zod";

interface VerifyResetOTPFormProps extends Omit<
  React.ComponentProps<typeof Card>,
  "onSubmit"
> {
  email: string;
}

export function VerifyResetOTPForm({
  email,
  ...props
}: VerifyResetOTPFormProps) {
  const router = useRouter();
  const [isResending, startTransition] = useTransition();

  const handleSubmit = async (values: z.infer<typeof otpSchema>) => {
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email: values.email,
      otp: values.otp,
      type: "forget-password",
    });

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    const params = new URLSearchParams();
    params.set("email", email);
    params.set("otp", values.otp);
    router.push(`/forgot-password/reset?${params.toString()}`);
  };

  const handleResend = (onSuccess?: () => void) =>
    startTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });

      if (error) {
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
