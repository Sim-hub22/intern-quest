import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .check(z.email())
    .check(z.minLength(1, "Email is required"))
    .check(z.trim()),
  password: z.string().check(z.minLength(1, "Password is required")),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    name: z.string().check(z.minLength(1, "Name is required")),
    email: z
      .string()
      .check(z.minLength(1, "Email is required"))
      .check(z.email())
      .check(z.trim()),
    password: z
      .string()
      .check(z.minLength(1, { error: "This field is required" }))
      .check(
        z.minLength(8, { error: "Password must be at least 8 characters long" })
      )
      .check(
        z.maxLength(100, {
          error: "Password must be at most 100 characters long",
        })
      )
      .check(
        z.regex(/[A-Z]/, {
          error: "Password must contain at least one uppercase letter",
        })
      )
      .check(
        z.regex(/[a-z]/, {
          error: "Password must contain at least one lowercase letter",
        })
      )
      .check(z.trim()),
    confirmPassword: z.string().check(z.minLength(1, "This field is required")),
    role: z.enum(["candidate", "recruiter", "admin"]).default("candidate"),
    agreeToTermsConditions: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });
