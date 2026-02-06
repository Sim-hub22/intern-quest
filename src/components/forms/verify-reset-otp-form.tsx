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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface VerifyResetOTPFormProps extends React.ComponentProps<typeof Card> {
  email: string;
}

export function VerifyResetOTPForm({
  email,
  ...props
}: VerifyResetOTPFormProps) {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email: values.email,
      otp: values.otp,
      type: "forget-password",
    });

    if (error) {
      toast.error(
        error.message || "Invalid or expired code. Please try again.",
      );
      return;
    }

    const params = new URLSearchParams();
    params.set("email", email);
    params.set("verified", "true");
    params.set("otp", values.otp);
    router.push(`/forgot-password/reset?${params.toString()}`);
  });

  const handleResend = async () => {
    setIsResending(true);
    const { error } = await authClient.emailOtp.requestPasswordReset({
      email,
    });
    setIsResending(false);

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    toast.success("New code sent!", {
      description: `We've sent a new code to ${email}`,
    });
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify your identity</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email}. Enter it below to continue.
        </CardDescription>
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
                disabled={isResending}
              >
                Resend
              </Button>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
