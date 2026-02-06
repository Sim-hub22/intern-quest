"use server";

import { actionClient } from "@/lib/safe-action";
import { auth } from "@/server/auth";
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
    try {
      await auth.api.signInEmail({
        body: {
          email: parsedInput.email,
          password: parsedInput.password,
          rememberMe: parsedInput.rememberMe,
        },
      });
      return { success: true };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if error is due to unverified email (status 403)
      if (error?.status === 403 || error?.statusCode === 403) {
        // Automatically send verification OTP when email is unverified
        try {
          await auth.api.sendVerificationOTP({
            body: {
              email: parsedInput.email,
              type: "email-verification",
            },
          });
        } catch (otpError) {
          // Log but don't fail if OTP sending fails
          console.error("Failed to send verification OTP:", otpError);
        }

        return {
          success: false,
          requiresVerification: true,
          email: parsedInput.email,
        };
      }
      throw error;
    }
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
      }),
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
