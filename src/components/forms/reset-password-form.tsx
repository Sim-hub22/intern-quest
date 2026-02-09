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
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { setNewPasswordSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  email: string;
  otp: string;
}

export function ResetPasswordForm({
  email,
  otp,
  className,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      email,
      otp,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: {
    email: string;
    otp: string;
    password: string;
  }) => {
    await authClient.emailOtp.resetPassword(
      {
        email: values.email,
        otp: values.otp,
        password: values.password,
      },
      {
        onSuccess: async () => {
          form.reset();
          toast.success("Password reset successfully!", {
            description: "You can now login with your new password.",
          });
          router.push("/login");
        },
        onError: ({ error }: { error?: { message?: string } }) => {
          toast.error(
            error?.message || "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Set new password</CardTitle>
          <CardDescription>Enter your new password for {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your new password"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm new password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm your new password"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Spinner /> : "Reset password"}
                </Button>
                <FieldDescription className="text-center">
                  Remember your password?{" "}
                  <Link href="/login" className="hover:text-primary">
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
