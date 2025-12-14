import { db } from "@/db"; // your drizzle instance
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        switch (type) {
          case "email-verification":
            // Send email verification OTP email
            // await resend.emails.send({
            //   from: "InternQuest <onboarding@resend.dev>",
            //   to: [email],
            //   subject: "Verify your InternQuest account",
            //   html: `Your verification code: ${otp}`,
            // });
            console.log(
              `[OTP]: You're verification code for ${email} is ${otp}`
            );
            break;
          case "forget-password":
            // Send password reset OTP email
            // await resend.emails.send({
            //   from: "InternQuest <onboarding@resend.dev>",
            //   to: [email],
            //   subject: "Reset your InternQuest password",
            //   html: `Your password reset code: ${otp}`,
            // });
            console.log(
              `[OTP]: You're password reset code for ${email} is ${otp}`
            );
            break;
        }
      },
    }),
  ],
});
