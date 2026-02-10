import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema/auth";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/server/email/emails";
import { redis } from "@/server/redis";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { emailOTP } from "better-auth/plugins/email-otp";
import { after } from "next/server";

export const auth = betterAuth({
  appName: "InternQuest",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secondaryStorage: {
    get: async (key) => {
      return await redis.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { ex: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["candidate", "recruiter", "admin"],
        required: true,
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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
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
      storage: "secondary-storage",
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
    admin({
      adminRoles: ["admin"],
      defaultRole: "candidate",
    }),
    nextCookies(),
  ],
});
