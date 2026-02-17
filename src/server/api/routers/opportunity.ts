import { TRPCError } from "@trpc/server";
import { and, desc, asc, eq, ilike, or, sql, count } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/server/db";
import { opportunity } from "@/server/db/schema/opportunity";
import {
  createOpportunitySchema,
  updateOpportunitySchema,
  updateOpportunityStatusSchema,
} from "@/validations/opportunity-schema";

import { publicProcedure, protectedProcedure, recruiterProcedure, router } from "../index";

export const opportunityRouter = router({
  create: recruiterProcedure
    .input(createOpportunitySchema)
    .mutation(async ({ ctx, input }) => {
      const [createdOpportunity] = await db
        .insert(opportunity)
        .values({
          title: input.title,
          description: input.description,
          type: input.type,
          mode: input.mode,
          location: input.location ?? null,
          category: input.category,
          skills: input.skills,
          stipend: input.stipend ?? null,
          duration: input.duration ?? null,
          deadline: input.deadline,
          positions: input.positions,
          status: "draft",
          recruiterId: ctx.session.user.id,
        })
        .returning();

      if (!createdOpportunity) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create opportunity",
        });
      }

      return createdOpportunity;
    }),

  update: recruiterProcedure
    .input(
      z
        .object({
          id: z.string().min(1, "Opportunity ID is required"),
        })
        .merge(updateOpportunitySchema),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // 1. Get existing opportunity
      const [existing] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check ownership
      if (existing.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own opportunities",
        });
      }

      // 3. Filter out undefined values from updateData
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined),
      );

      // 4. Update opportunity and set updatedAt using database timestamp
      await db
        .update(opportunity)
        .set({
          ...cleanedUpdateData,
          updatedAt: sql`now()`,
        })
        .where(eq(opportunity.id, id));

      // 5. Fetch the updated opportunity to ensure we get the latest data
      const [updated] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update opportunity",
        });
      }

      return updated;
    }),

  delete: recruiterProcedure
    .input(
      z.object({
        id: z.string().min(1, "Opportunity ID is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // 1. Get existing opportunity
      const [existing] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check ownership
      if (existing.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own opportunities",
        });
      }

      // 3. Soft delete by setting status to 'archived'
      await db
        .update(opportunity)
        .set({
          status: "archived",
          updatedAt: sql`now()`,
        })
        .where(eq(opportunity.id, id));

      // 4. Fetch the updated opportunity to ensure we get the latest data
      const [deleted] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!deleted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete opportunity",
        });
      }

      return deleted;
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1, "Opportunity ID is required"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;

      // 1. Get opportunity
      const [opp] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!opp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check authorization based on status
      const isPublic = opp.status === "published" || opp.status === "closed";
      const isOwner = ctx.session?.user?.id === opp.recruiterId;

      if (!isPublic && !isOwner) {
        // Draft or archived, but not owner - return NOT_FOUND for security
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      return opp;
    }),

  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        type: z
          .enum(["internship", "fellowship", "volunteer"])
          .optional(),
        mode: z.enum(["remote", "onsite", "hybrid"]).optional(),
        limit: z.number().min(1).default(10).optional(),
        offset: z.number().min(0).default(0).optional(),
        sortBy: z
          .enum(["createdAt", "deadline", "updatedAt"])
          .default("createdAt")
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const {
        search,
        category,
        type,
        mode,
        limit: rawLimit = 10,
        offset = 0,
        sortBy = "createdAt",
      } = input;

      // Enforce maximum limit of 100
      const limit = Math.min(rawLimit, 100);

      // Build WHERE conditions
      const conditions = [];

      // Only show published and closed opportunities (not draft or archived)
      conditions.push(
        or(
          eq(opportunity.status, "published"),
          eq(opportunity.status, "closed"),
        ),
      );

      // Search in title or description (case-insensitive)
      if (search) {
        conditions.push(
          or(
            ilike(opportunity.title, `%${search}%`),
            ilike(opportunity.description, `%${search}%`),
          ),
        );
      }

      // Filter by category
      if (category) {
        conditions.push(eq(opportunity.category, category));
      }

      // Filter by type
      if (type) {
        conditions.push(eq(opportunity.type, type));
      }

      // Filter by mode
      if (mode) {
        conditions.push(eq(opportunity.mode, mode));
      }

      // Determine sort order
      let orderByClause;
      if (sortBy === "deadline") {
        orderByClause = asc(opportunity.deadline);
      } else if (sortBy === "updatedAt") {
        orderByClause = desc(opportunity.updatedAt);
      } else {
        // Default to createdAt descending
        orderByClause = desc(opportunity.createdAt);
      }

      // Execute query with all conditions
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(opportunity)
        .where(whereClause);

      const total = countResult?.count ?? 0;

      // Get opportunities with pagination
      const opportunities = await db
        .select()
        .from(opportunity)
        .where(whereClause)
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset);

      return {
        opportunities,
        total,
      };
    }),

  listByRecruiter: protectedProcedure
    .input(
      z.object({
        recruiterId: z.string().min(1, "Recruiter ID is required"),
        status: z
          .enum(["draft", "published", "closed", "archived"])
          .optional(),
        limit: z.number().min(1).default(10).optional(),
        offset: z.number().min(0).default(0).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        recruiterId,
        status,
        limit: rawLimit = 10,
        offset = 0,
      } = input;

      // Enforce maximum limit of 100
      const limit = Math.min(rawLimit, 100);

      // Build WHERE conditions
      const conditions = [];

      // Always filter by recruiterId
      conditions.push(eq(opportunity.recruiterId, recruiterId));

      // Check if viewing own opportunities or others'
      const isOwner = ctx.session.user.id === recruiterId;

      if (!isOwner) {
        // If viewing others' opportunities, only show published/closed
        conditions.push(
          or(
            eq(opportunity.status, "published"),
            eq(opportunity.status, "closed"),
          ),
        );
      }

      // Apply status filter if provided
      if (status) {
        // Only allow filtering for draft/archived if viewing own opportunities
        if (!isOwner && (status === "draft" || status === "archived")) {
          // Return empty result for non-owners trying to filter draft/archived
          return {
            opportunities: [],
            total: 0,
          };
        }
        conditions.push(eq(opportunity.status, status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(opportunity)
        .where(whereClause);

      const total = countResult?.count ?? 0;

      // Get opportunities with pagination, sorted by createdAt descending
      const opportunities = await db
        .select()
        .from(opportunity)
        .where(whereClause)
        .orderBy(desc(opportunity.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        opportunities,
        total,
      };
    }),

  updateStatus: recruiterProcedure
    .input(
      z
        .object({
          id: z.string().min(1, "Opportunity ID is required"),
        })
        .merge(updateOpportunityStatusSchema),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // 1. Get existing opportunity
      const [existing] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check ownership
      if (existing.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own opportunities",
        });
      }

      // 3. Update status
      await db
        .update(opportunity)
        .set({
          status,
          updatedAt: sql`now()`,
        })
        .where(eq(opportunity.id, id));

      // 4. Fetch updated opportunity
      const [updated] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, id));

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update opportunity status",
        });
      }

      return updated;
    }),
});
