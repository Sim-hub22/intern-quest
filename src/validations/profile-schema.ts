import z from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .check(z.minLength(1, "This field is required"))
      .check(z.minLength(2, "Name must be at least 2 characters long"))
      .check(z.maxLength(100, "Name must be at most 100 characters long"))
      .check(z.trim()),
    bio: z
      .string()
      .check(z.trim())
      .check(z.maxLength(500, "Bio must be at most 500 characters long")),
    phone: z
      .string()
      .check(z.trim())
      .check(z.maxLength(20, "Phone must be at most 20 characters long")),
    location: z
      .string()
      .check(z.trim())
      .check(z.maxLength(100, "Location must be at most 100 characters long")),
    resumeUrl: z.string().check(z.trim()).check(z.url()),
    linkedinUrl: z.string().check(z.trim()).check(z.url()),
    website: z.string().check(z.trim()).check(z.url()),
  })
  .partial();

export const getPublicProfileSchema = z.object({
  userId: z.string().check(z.minLength(1, "This field is required")).check(z.trim()),
});
