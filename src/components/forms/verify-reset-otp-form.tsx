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
import { useTransition } from "react";
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
  const [isResending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const onSubmit = async (values: { email: string; otp: string }) => {
    await authClient.emailOtp.checkVerificationOtp(
      {
        email: values.email,
        otp: values.otp,
        type: "forget-password",
      },
      {
        onSuccess: () => {
          // Navigate to the same page with verified params
          const params = new URLSearchParams();
          params.set("email", email);
          params.set("verified", "true");
          params.set("otp", values.otp);
          router.push(`/reset-password?${params.toString()}`);
        },
        onError: ({ error }: { error?: { message?: string } }) => {
          toast.error(
            error?.message || "Invalid or expired code. Please try again.",
          );
        },
      },
    );
  };

  const handleResend = () =>
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
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify your identity</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email}. Enter it below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  disabled={isResending}
                >
                  Resend
                </Button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
