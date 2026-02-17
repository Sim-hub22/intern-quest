import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { user } from "@/server/db/schema/auth";
import {
  getPublicProfileSchema,
  updateProfileSchema,
} from "@/validations/profile-schema";

import { protectedProcedure, publicProcedure, router } from "../index";

export const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    // Fetch user profile from database
    const [profile] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        banned: user.banned,
        organization: user.organization,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        resumeUrl: user.resumeUrl,
        linkedinUrl: user.linkedinUrl,
        website: user.website,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, ctx.session.user.id));

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found",
      });
    }

    return profile;
  }),

  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      // Build update object - only include fields that are provided
      const updateData: Record<string, string | undefined> = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.resumeUrl !== undefined) updateData.resumeUrl = input.resumeUrl;
      if (input.linkedinUrl !== undefined)
        updateData.linkedinUrl = input.linkedinUrl;
      if (input.website !== undefined) updateData.website = input.website;

      // Update user profile in database
      const [updated] = await db
        .update(user)
        .set({
          ...updateData,
          updatedAt: sql`now()`,
        })
        .where(eq(user.id, ctx.session.user.id))
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          banned: user.banned,
          organization: user.organization,
          bio: user.bio,
          phone: user.phone,
          location: user.location,
          resumeUrl: user.resumeUrl,
          linkedinUrl: user.linkedinUrl,
          website: user.website,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }

      return updated;
    }),

  getPublic: publicProcedure
    .input(getPublicProfileSchema)
    .query(async ({ input }) => {
      const { userId } = input;

      // Fetch limited public profile fields
      const [profile] = await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          role: user.role,
          bio: user.bio,
          location: user.location,
          linkedinUrl: user.linkedinUrl,
          website: user.website,
          organization: user.organization,
        })
        .from(user)
        .where(eq(user.id, userId));

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return profile;
    }),
});
