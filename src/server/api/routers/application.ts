import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { application } from "@/server/db/schema/application";
import { opportunity } from "@/server/db/schema/opportunity";
import {
  createApplicationSchema,
  getApplicationByIdSchema,
  listApplicationsByCandidateSchema,
  listApplicationsByOpportunitySchema,
  updateApplicationStatusSchema,
  withdrawApplicationSchema,
} from "@/validations/application-schema";

import {
  candidateProcedure,
  protectedProcedure,
  recruiterProcedure,
  router,
} from "../index";

export const applicationRouter = router({
  create: candidateProcedure
    .input(createApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { opportunityId, coverLetter, resumeUrl } = input;

      // 1. Check if opportunity exists
      const [opp] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, opportunityId));

      if (!opp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check if opportunity is published
      if (opp.status !== "published") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This opportunity is not accepting applications",
        });
      }

      // 3. Check for duplicate application
      const [existing] = await db
        .select()
        .from(application)
        .where(
          and(
            eq(application.opportunityId, opportunityId),
            eq(application.candidateId, ctx.session.user.id),
          ),
        );

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already applied to this opportunity",
        });
      }

      // 4. Create application
      const [created] = await db
        .insert(application)
        .values({
          opportunityId,
          candidateId: ctx.session.user.id,
          coverLetter: coverLetter ?? null,
          resumeUrl: resumeUrl ?? null,
          status: "pending",
        })
        .returning();

      if (!created) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create application",
        });
      }

      return created;
    }),

  getById: protectedProcedure
    .input(getApplicationByIdSchema)
    .query(async ({ ctx, input }) => {
      const { id } = input;

      // 1. Fetch the application
      const [app] = await db
        .select()
        .from(application)
        .where(eq(application.id, id));

      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      // 2. Check authorization
      // Candidates can view their own applications
      if (ctx.session.user.role === "candidate") {
        if (app.candidateId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view this application",
          });
        }
        return app;
      }

      // Recruiters can view applications to their opportunities
      if (ctx.session.user.role === "recruiter") {
        const [opp] = await db
          .select()
          .from(opportunity)
          .where(eq(opportunity.id, app.opportunityId));

        if (!opp) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Opportunity not found",
          });
        }

        if (opp.recruiterId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view this application",
          });
        }

        return app;
      }

      // Admin can view all applications
      if (ctx.session.user.role === "admin") {
        return app;
      }

      // Fallback - should not reach here
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view this application",
      });
    }),

  listByCandidate: candidateProcedure
    .input(listApplicationsByCandidateSchema)
    .query(async ({ ctx, input }) => {
      const { status, limit: rawLimit, offset } = input;

      // Clamp limit to maximum of 100
      const limit = rawLimit ? Math.min(rawLimit, 100) : 50;

      // Build where conditions
      const conditions = [eq(application.candidateId, ctx.session.user.id)];

      if (status) {
        conditions.push(eq(application.status, status));
      }

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(application)
        .where(and(...conditions));

      const total = countResult?.count ?? 0;

      // Get applications
      const applications = await db
        .select()
        .from(application)
        .where(and(...conditions))
        .orderBy(desc(application.appliedAt))
        .limit(limit)
        .offset(offset ?? 0);

      return {
        applications,
        total,
      };
    }),

  listByOpportunity: recruiterProcedure
    .input(listApplicationsByOpportunitySchema)
    .query(async ({ ctx, input }) => {
      const { opportunityId, status, limit: rawLimit, offset } = input;

      // 1. Check if opportunity exists
      const [opp] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, opportunityId));

      if (!opp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      // 2. Check if recruiter owns this opportunity
      if (opp.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "You do not have permission to view applications for this opportunity",
        });
      }

      // 3. Clamp limit to maximum of 100
      const limit = rawLimit ? Math.min(rawLimit, 100) : 50;

      // 4. Build where conditions
      const conditions = [eq(application.opportunityId, opportunityId)];

      if (status) {
        conditions.push(eq(application.status, status));
      }

      // 5. Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(application)
        .where(and(...conditions));

      const total = countResult?.count ?? 0;

      // 6. Get applications
      const applications = await db
        .select()
        .from(application)
        .where(and(...conditions))
        .orderBy(desc(application.appliedAt))
        .limit(limit)
        .offset(offset ?? 0);

      return {
        applications,
        total,
      };
    }),

  updateStatus: recruiterProcedure
    .input(updateApplicationStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      // 1. Fetch the application
      const [app] = await db
        .select()
        .from(application)
        .where(eq(application.id, id));

      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      // 2. Check if recruiter owns the opportunity
      const [opp] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, app.opportunityId));

      if (!opp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      if (opp.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this application",
        });
      }

      // 3. Update the application status
      const [updated] = await db
        .update(application)
        .set({
          status,
          updatedAt: sql`now()`,
        })
        .where(eq(application.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update application status",
        });
      }

      return updated;
    }),

  withdraw: candidateProcedure
    .input(withdrawApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // 1. Fetch the application
      const [app] = await db
        .select()
        .from(application)
        .where(eq(application.id, id));

      if (!app) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      }

      // 2. Check if candidate owns this application
      if (app.candidateId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to withdraw this application",
        });
      }

      // 3. Check if application can be withdrawn
      if (app.status === "withdrawn") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Application is already withdrawn",
        });
      }

      if (app.status === "accepted" || app.status === "rejected") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot withdraw an accepted or rejected application",
        });
      }

      // 4. Update the application status to withdrawn
      const [updated] = await db
        .update(application)
        .set({
          status: "withdrawn",
          updatedAt: sql`now()`,
        })
        .where(eq(application.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to withdraw application",
        });
      }

      return updated;
    }),
});
