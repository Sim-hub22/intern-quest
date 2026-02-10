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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { signUpSchema } from "@/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2Icon,
  GraduationCapIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const roles = [
  {
    title: "Candidate",
    value: "candidate",
    description: "Looking for internships",
    icon: <GraduationCapIcon />,
  },
  {
    title: "Recruiter",
    value: "recruiter",
    description: "Looking to hire interns",
    icon: <Building2Icon />,
  },
];

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: "candidate",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
    },
  });

  const role = useWatch({ control: form.control, name: "role" });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    const { data, error } = await authClient.signUp.email({
      ...values,
    });

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    form.reset();
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set("email", data.user.email);
    router.push(`/signup/verify?${urlSearchParams.toString()}`);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Start your journey to the perfect internship
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend>I want to sign up as:</FieldLegend>
                    <div className="grid grid-cols-2 gap-4">
                      <RadioGroup
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="contents"
                        required
                      >
                        {roles.map((role) => {
                          const isSelected = field.value === role.value;
                          return (
                            <FieldLabel
                              key={role.value}
                              htmlFor={role.value}
                              className="relative"
                              aria-invalid={fieldState.invalid}
                            >
                              <Field
                                data-invalid={fieldState.invalid}
                                className="p-2!"
                              >
                                <FieldContent className="items-center">
                                  <div
                                    className={cn(
                                      "size-10 rounded-full flex items-center justify-center text-3xl transition-all bg-muted",
                                      isSelected &&
                                        "bg-primary text-primary-foreground",
                                    )}
                                  >
                                    {role.icon}
                                  </div>
                                  <FieldTitle
                                    className={`${
                                      isSelected &&
                                      "text-primary transition-all"
                                    }`}
                                  >
                                    {role.title}
                                  </FieldTitle>
                                  <FieldDescription className="text-xs">
                                    {role.description}
                                  </FieldDescription>
                                </FieldContent>
                              </Field>
                              <RadioGroupItem
                                value={role.value}
                                id={role.value}
                                aria-invalid={fieldState.invalid}
                                className="absolute top-2 right-2"
                              />
                            </FieldLabel>
                          );
                        })}
                      </RadioGroup>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />

              {/* Full Name */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <InputGroup className="bg-background">
                      <InputGroupAddon>
                        <UserIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your name"
                        required
                      />
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <InputGroup className="bg-background">
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

              {/* Organization (Only for Recruiter) */}
              {role === "recruiter" && (
                <Controller
                  control={form.control}
                  name="organization"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Company/Organization
                      </FieldLabel>
                      <InputGroup className="bg-background">
                        <InputGroupAddon>
                          <Building2Icon />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id={field.name}
                          type="text"
                          aria-invalid={fieldState.invalid}
                          placeholder="Enter your company name"
                          required
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {/* Password */}
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Create a password"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Confirm Password */}
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm your password"
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
                  {form.formState.isSubmitting ? <Spinner /> : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
