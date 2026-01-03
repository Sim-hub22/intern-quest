"use client";

import { forgotPasswordAction } from "@/actions/auth-action";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { ArrowLeftIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    form,
    action: { isExecuting },
    handleSubmitWithAction,
    resetFormAndAction,
  } = useHookFormAction(
    forgotPasswordAction,
    zodResolver(forgotPasswordSchema),
    {
      actionProps: {
        onSuccess: async ({ input }) => {
          resetFormAndAction();
          const urlSearchParams = new URLSearchParams();
          urlSearchParams.set("email", input.email);
          router.push(`/reset-password?${urlSearchParams}`);
        },
        onError: ({ error }) => {
          toast.error(
            error.serverError || "Something went wrong. Please try again."
          );
        },
      },
      formProps: {
        defaultValues: {
          email: "",
        },
      },
    }
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a code to reset
            your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitWithAction}>
            <FieldGroup className="gap-4">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your email"
                        required
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button type="submit" disabled={isExecuting}>
                  {isExecuting ? <Spinner /> : "Send reset code"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 hover:text-primary"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Remember your password?{" "}
        <Link href="/login" className="hover:text-primary">
          Login
        </Link>
      </FieldDescription>
    </div>
  );
}
