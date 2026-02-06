import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema/auth";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/server/email/emails";
import { createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

const ALLOWED_PUBLIC_SIGNUP_ROLES = ["candidate", "recruiter"] as const;

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const role = ctx.body?.role as string | undefined;
      const allowedRoles: readonly string[] = ALLOWED_PUBLIC_SIGNUP_ROLES;
      if (role && !allowedRoles.includes(role)) {
        return {
          context: {
            ...ctx,
            body: { ...ctx.body, role: "candidate" as const },
          },
        };
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "candidate",
        input: true,
      },
      organization: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        switch (type) {
          case "email-verification":
            void sendVerificationEmail({ email, otp });
            break;
          case "forget-password":
            void sendPasswordResetEmail({ email, otp });
            break;
        }
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
