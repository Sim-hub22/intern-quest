import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.email())
    .check(z.trim()),
  password: z.string().check(z.minLength(1, "This field is required")),
  rememberMe: z.boolean().optional(),
});

export const signUpSchema = z
  .object({
    name: z.string().check(z.minLength(1, "This field is required")),
    email: z
      .string()
      .check(z.minLength(1, "This field is required"))
      .check(z.email())
      .check(z.trim()),
    password: z
      .string()
      .check(z.minLength(1, { error: "This field is required" }))
      .check(
        z.minLength(8, {
          error: "Password must be at least 8 characters long",
        }),
      )
      .check(
        z.regex(/[A-Z]/, {
          error: "Password must contain at least one uppercase letter",
        }),
      )
      .check(
        z.regex(/[a-z]/, {
          error: "Password must contain at least one lowercase letter",
        }),
      )
      .check(z.trim()),
    confirmPassword: z.string().check(z.minLength(1, "This field is required")),
    role: z.enum(["candidate", "recruiter"]).default("candidate"),
    organization: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.role !== "recruiter" || data.organization?.trim(), {
    message: "This field is required",
    path: ["organization"],
  });

export const otpSchema = z.object({
  otp: z
    .string()
    .check(z.length(6, "OTP must be exactly 6 digits"))
    .check(z.regex(/^\d+$/, "OTP must contain only numbers")),
  email: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.email()),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.email())
    .check(z.trim()),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .check(z.minLength(1, "This field is required"))
      .check(z.email())
      .check(z.trim()),
    otp: z
      .string()
      .check(z.length(6, "OTP must be exactly 6 digits"))
      .check(z.regex(/^\d+$/, "OTP must contain only numbers")),
    password: z
      .string()
      .check(z.minLength(1, { error: "This field is required" }))
      .check(
        z.minLength(8, {
          error: "Password must be at least 8 characters long",
        }),
      )
      .check(
        z.regex(/[A-Z]/, {
          error: "Password must contain at least one uppercase letter",
        }),
      )
      .check(
        z.regex(/[a-z]/, {
          error: "Password must contain at least one lowercase letter",
        }),
      )
      .check(z.trim()),
    confirmPassword: z.string().check(z.minLength(1, "This field is required")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const setNewPasswordSchema = z
  .object({
    email: z
      .string()
      .check(z.minLength(1, "This field is required"))
      .check(z.email())
      .check(z.trim()),
    otp: z
      .string()
      .check(z.length(6, "OTP must be exactly 6 digits"))
      .check(z.regex(/^\d+$/, "OTP must contain only numbers")),
    password: z
      .string()
      .check(z.minLength(1, { error: "This field is required" }))
      .check(
        z.minLength(8, {
          error: "Password must be at least 8 characters long",
        }),
      )
      .check(
        z.regex(/[A-Z]/, {
          error: "Password must contain at least one uppercase letter",
        }),
      )
      .check(
        z.regex(/[a-z]/, {
          error: "Password must contain at least one lowercase letter",
        }),
      )
      .check(z.trim()),
    confirmPassword: z.string().check(z.minLength(1, "This field is required")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
