"use server";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/safe-action";
import {
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  setNewPasswordSchema,
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
    return { success: true };
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
    return { success: true };
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
    return { success: true };
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
    return { success: true };
  });

export const forgotPasswordAction = actionClient
  .inputSchema(forgotPasswordSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.forgetPasswordEmailOTP({
      body: {
        email: parsedInput.email,
      },
    });
    return { success: true };
  });

export const resetPasswordAction = actionClient
  .inputSchema(resetPasswordSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
        password: parsedInput.password,
      },
    });
    return { success: true };
  });

export const verifyResetPasswordOTPAction = actionClient
  .inputSchema(otpSchema)
  .action(async ({ parsedInput }) => {
    // Validates the OTP is correct without consuming it
    const data = await auth.api.checkVerificationOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
        type: "forget-password",
      },
    });
    return data;
  });

export const checkResetPasswordOTPAction = actionClient
  .inputSchema(otpSchema)
  .action(async ({ parsedInput }) => {
    // Validates the OTP is correct without consuming it
    // Returns success if OTP is valid, throws error if invalid/expired
    const data = await auth.api.checkVerificationOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
        type: "forget-password",
      },
    });
    return data;
  });

export const setNewPasswordAction = actionClient
  .inputSchema(setNewPasswordSchema)
  .action(async ({ parsedInput }) => {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email: parsedInput.email,
        otp: parsedInput.otp,
        password: parsedInput.password,
      },
    });
    return { success: true };
  });
