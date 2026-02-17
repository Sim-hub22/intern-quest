import z from "zod";

export const createApplicationSchema = z.object({
  opportunityId: z.string().check(z.minLength(1, "This field is required")),
  coverLetter: z
    .string()
    .check(z.trim())
    .check(
      z.minLength(50, "Cover letter must be at least 50 characters long"),
    )
    .check(
      z.maxLength(2000, "Cover letter must be at most 2000 characters long"),
    )
    .optional(),
  resumeUrl: z.string().check(z.trim()).check(z.url()).optional(),
});

export const getApplicationByIdSchema = z.object({
  id: z.string().check(z.minLength(1, "This field is required")).check(z.trim()),
});

export const listApplicationsByCandidateSchema = z.object({
  status: z
    .enum([
      "pending",
      "reviewing",
      "shortlisted",
      "accepted",
      "rejected",
      "withdrawn",
    ])
    .optional(),
  limit: z.number().check(z.gte(1)).optional(),
  offset: z.number().check(z.gte(0)).optional(),
});

export const listApplicationsByOpportunitySchema = z.object({
  opportunityId: z.string().check(z.minLength(1, "This field is required")),
  status: z
    .enum([
      "pending",
      "reviewing",
      "shortlisted",
      "accepted",
      "rejected",
      "withdrawn",
    ])
    .optional(),
  limit: z.number().check(z.gte(1)).optional(),
  offset: z.number().check(z.gte(0)).optional(),
});

export const updateApplicationStatusSchema = z.object({
  id: z.string().check(z.minLength(1, "This field is required")).check(z.trim()),
  status: z.enum([
    "pending",
    "reviewing",
    "shortlisted",
    "accepted",
    "rejected",
    "withdrawn",
  ]),
});

export const withdrawApplicationSchema = z.object({
  id: z.string().check(z.minLength(1, "This field is required")).check(z.trim()),
});
