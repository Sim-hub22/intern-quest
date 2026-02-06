"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { otpSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { useInterval } from "react-use";
import { toast } from "sonner";

interface VerifyEmailOTPFormProps extends React.ComponentProps<typeof Card> {
  email: string;
  callbackUrl?: string;
}

export function VerifyEmailOTPForm({
  email,
  callbackUrl,
  ...props
}: VerifyEmailOTPFormProps) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const [countdown, setCountdown] = useState(0);
  const [isResending, startResendTransition] = useTransition();

  // Countdown timer using react-use's useInterval
  useInterval(
    () => {
      setCountdown((prev) => prev - 1);
    },
    countdown > 0 ? 1000 : null,
  );

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    const { error } = await authClient.emailOtp.verifyEmail({
      email: values.email,
      otp: values.otp,
    });

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    await refetch();
    form.reset();
    const redirectTo =
      callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";
    router.push(redirectTo);
  });

  const handleResend = async () => {
    startResendTransition(async () => {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        toast.error(error.message || "Something went wrong. Please try again.");
        return;
      }

      setCountdown(60);
      toast.success("New code sent!", {
        description: `We've sent a new code to ${email}`,
      });
    });
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className="sr-only">
                    Verification code
                  </FieldLabel>
                  <InputOTP {...field} maxLength={6} id={field.name} required>
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border mx-auto">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          aria-invalid={fieldState.invalid}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid && (
                    <FieldError
                      className="text-center"
                      errors={[fieldState.error]}
                    />
                  )}
                  <FieldDescription className="text-center">
                    Enter the 6-digit code sent to your email.
                  </FieldDescription>
                </Field>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Verify"}
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-fit"
                onClick={handleResend}
                disabled={isResending || countdown > 0}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
              </Button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
