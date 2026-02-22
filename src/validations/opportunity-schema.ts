import z from "zod";

export const createOpportunitySchema = z.object({
  title: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.minLength(5, "Title must be at least 5 characters long"))
    .check(z.maxLength(200, "Title must be at most 200 characters long"))
    .check(z.trim()),
  description: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.minLength(20, "Description must be at least 20 characters long"))
    .check(z.trim()),
  type: z.enum(["internship", "fellowship", "volunteer"]),
  mode: z.enum(["remote", "onsite", "hybrid"]),
  location: z.string().optional(),
  category: z.string().check(z.minLength(1, "This field is required")),
  skills: z.array(z.string()).default([]),
  stipend: z
    .number()
    .check(z.gt(0, "Stipend must be greater than 0 (use null for unpaid)"))
    .nullable()
    .optional(),
  duration: z.string().optional(),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }),
  positions: z
    .number()
    .check(z.gte(1, "Positions must be at least 1"))
    .check(z.lte(100, "Positions must be at most 100"))
    .default(1),
});

// For updates, we need to remove defaults to avoid overwriting existing values
const updateBaseSchema = z.object({
  title: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.minLength(5, "Title must be at least 5 characters long"))
    .check(z.maxLength(200, "Title must be at most 200 characters long"))
    .check(z.trim())
    .optional(),
  description: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.minLength(20, "Description must be at least 20 characters long"))
    .check(z.trim())
    .optional(),
  type: z.enum(["internship", "fellowship", "volunteer"]).optional(),
  mode: z.enum(["remote", "onsite", "hybrid"]).optional(),
  location: z.string().optional(),
  category: z.string().check(z.minLength(1, "This field is required")).optional(),
  skills: z.array(z.string()).optional(), // No default for updates
  stipend: z
    .number()
    .check(z.gt(0, "Stipend must be greater than 0 (use null for unpaid)"))
    .nullable()
    .optional(),
  duration: z.string().optional(),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }).optional(),
  positions: z
    .number()
    .check(z.gte(1, "Positions must be at least 1"))
    .check(z.lte(100, "Positions must be at most 100"))
    .optional(), // No default for updates
});

export const updateOpportunitySchema = updateBaseSchema;

export const updateOpportunityStatusSchema = z.object({
  status: z.enum(["draft", "published", "closed", "archived"]),
});
