import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema/auth";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/server/email/emails";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { after } from "next/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
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
  trustedOrigins: [env.BETTER_AUTH_URL],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
      storage: "database",
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        switch (type) {
          case "email-verification":
            after(() =>
              sendVerificationEmail({ email, otp }).catch((err) =>
                console.error("Verification email failed", err),
              ),
            );
            break;
          case "forget-password":
            after(() =>
              sendPasswordResetEmail({ email, otp }).catch((err) =>
                console.error("Password reset email failed", err),
              ),
            );
            break;
        }
      },
    }),
    nextCookies(),
  ],
});
