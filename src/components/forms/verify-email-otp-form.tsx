"use client";

import {
  sendVerificationOTPAction,
  verifyEmailOTPAction,
} from "@/actions/auth-action";
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
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

interface VerifyEmailOTPFormProps extends React.ComponentProps<typeof Card> {
  email: string;
}

export function VerifyEmailOTPForm({
  email,
  ...props
}: VerifyEmailOTPFormProps) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const {
    form,
    action: { isExecuting },
    handleSubmitWithAction,
    resetFormAndAction,
  } = useHookFormAction(verifyEmailOTPAction, zodResolver(otpSchema), {
    actionProps: {
      onSuccess: async () => {
        await refetch();
        resetFormAndAction();
        router.push("/");
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError || "Something went wrong. Please try again."
        );
      },
    },
    formProps: {
      defaultValues: {
        email,
        otp: "",
      },
    },
  });

  const resend = useAction(sendVerificationOTPAction, {
    onSuccess: () => {
      toast.success("New code sent!", {
        description: `We've sent a new code to ${email}`,
      });
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError || "Something went wrong. Please try again."
      );
    },
  });

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitWithAction}>
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
            <Button type="submit" disabled={isExecuting}>
              {isExecuting ? <Spinner /> : "Verify"}
            </Button>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-fit"
                onClick={() => {
                  resend.execute({
                    email,
                    type: "email-verification",
                  });
                }}
                disabled={resend.isExecuting}
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
