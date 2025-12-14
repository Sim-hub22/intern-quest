"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import {
  loginSchema,
  otpSchema,
  signUpSchema,
} from "@/validations/auth-schema";
import z from "zod";

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.signInEmail({
      body: {
        email: parsedInput.email,
        password: parsedInput.password,
        rememberMe: parsedInput.rememberMe,
      },
    });
  });

export const googleLoginAction = actionClient.action(async () => {
  await auth.api.signInSocial({
    body: {
      provider: "google",
    },
  });
});

export const signUpAction = actionClient
  .inputSchema(signUpSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.signUpEmail({
      body: {
        name: parsedInput.name,
        email: parsedInput.email,
        password: parsedInput.password,
        role: parsedInput.role,
        organization: parsedInput.organization,
      },
    });
  });

export const sendVerificationOTPAction = actionClient
  .inputSchema(
    otpSchema
      .pick({
        email: true,
      })
      .extend({
        type: z
          .enum(["sign-in", "email-verification", "forget-password"])
          .default("email-verification"),
      })
  )
  .action(async ({ parsedInput }) => {
    await auth.api.sendVerificationOTP({
      body: {
        email: parsedInput.email,
        type: parsedInput.type,
      },
    });
  });

export const verifyEmailOTPAction = actionClient
  .inputSchema(otpSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.verifyEmailOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
      },
    });
  });
