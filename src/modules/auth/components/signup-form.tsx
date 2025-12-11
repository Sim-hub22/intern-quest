"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import SocialSigninButton from "@/modules/auth/components/social-signin-button";
import { signupSchema } from "@/modules/auth/validations/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2Icon,
  GraduationCapIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
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

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "candidate",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
      agreeToTermsConditions: false,
    },
  });

  const role = useWatch({ control: form.control, name: "role" });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      organization: data.organization,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* User Type Seclection */}
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
                aria-invalid={fieldState.invalid}
                className="contents"
              >
                {roles.map((role) => {
                  const isSelected = field.value === role.value;
                  return (
                    <FieldLabel
                      key={role.value}
                      htmlFor={role.value}
                      className="cursor-pointer rounded-xl w-full"
                    >
                      <div
                        className={`relative size-full p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background"
                        }`}
                      >
                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Icon Circle */}
                        <div
                          className={`size-12 rounded-full mb-3 flex items-center justify-center text-3xl transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {role.icon}
                        </div>

                        {/* Title */}
                        <h3
                          className={cn(
                            "text-sm text-center",
                            isSelected ? "text-primary" : "text-foreground"
                          )}
                        >
                          {role.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-gray-600 text-center mt-1">
                          {role.description}
                        </p>

                        {/* Hidden Radio Button */}
                        <RadioGroupItem
                          value={role.value}
                          id={role.value}
                          aria-invalid={fieldState.invalid}
                          className="hidden"
                        />
                      </div>
                    </FieldLabel>
                  );
                })}
              </RadioGroup>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                type="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your name"
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <FieldLabel htmlFor={field.name}>Company/Organization</FieldLabel>
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
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              type="passsword"
              aria-invalid={fieldState.invalid}
              placeholder="Create a password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <PasswordInput
              {...field}
              id={field.name}
              type="passsword"
              aria-invalid={fieldState.invalid}
              placeholder="Confirm your password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Terms & Conditions */}
      <Controller
        control={form.control}
        name="agreeToTermsConditions"
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                name={field.name}
                aria-invalid={fieldState.invalid}
                checked={field.value}
                onCheckedChange={field.onChange}
                className="bg-background"
              />
              <FieldLabel htmlFor={field.name} className="font-normal">
                I agree to the{" "}
                <Button
                  className={`p-0 ${
                    fieldState.invalid
                      ? "text-destructive hover:text-destructive/80"
                      : "text-primary hover:text-primary/80"
                  }`}
                  variant="link"
                  asChild
                >
                  <Link href="#">Terms and Conditions</Link>
                </Button>{" "}
                and{" "}
                <Button
                  className={`p-0 ${
                    fieldState.invalid
                      ? "text-destructive hover:text-destructive/80"
                      : "text-primary hover:text-primary/80"
                  }`}
                  variant="link"
                  asChild
                >
                  <Link href="#">Privacy Policy</Link>
                </Button>
              </FieldLabel>
            </Field>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </div>
        )}
      />

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full mb-0">
        Create Account
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-muted text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Social Sign Up */}
      <SocialSigninButton />
    </form>
  );
}
