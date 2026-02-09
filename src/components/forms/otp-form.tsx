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
import { otpSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useInterval } from "react-use";

interface OtpFormProps extends Omit<React.ComponentProps<typeof Card>, "onSubmit"> {
  email: string;
  title: string;
  description: string;
  onSubmit: (values: { email: string; otp: string }) => Promise<void>;
  onResend: (onSuccess?: () => void) => void;
  isResending?: boolean;
  resendCooldownSeconds?: number;
}

export function OtpForm({
  email,
  title,
  description,
  onSubmit,
  onResend,
  isResending = false,
  resendCooldownSeconds = 0,
  ...props
}: OtpFormProps) {
  const [countdown, setCountdown] = useState(0);

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

  const handleSubmit = async (values: { email: string; otp: string }) => {
    await onSubmit(values);
  };

  const handleResend = () => {
    onResend(() => {
      // Start countdown after successful resend if cooldown is enabled
      if (resendCooldownSeconds > 0) {
        setCountdown(resendCooldownSeconds);
      }
    });
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
            <Field>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : "Verify"}
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
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
