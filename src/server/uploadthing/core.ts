import { auth } from "@/server/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * UploadThing file router
 * Defines upload routes with auth checks, file type restrictions, and size limits
 */
export const ourFileRouter = {
  /**
   * Resume upload for candidates
   * - PDF only
   * - Max 4MB
   * - Requires authenticated candidate user
   */
  resumeUpload: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user || session.user.role !== "candidate") {
        throw new UploadThingError("Unauthorized - candidate access required");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  /**
   * Cover letter / application-specific resume upload
   * - PDF only
   * - Max 4MB
   * - Requires authenticated candidate user
   */
  coverLetterUpload: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user || session.user.role !== "candidate") {
        throw new UploadThingError("Unauthorized - candidate access required");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  /**
   * Profile image upload
   * - Images only (jpg, png, gif, webp)
   * - Max 2MB
   * - Requires any authenticated user
   */
  profileImage: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized - authentication required");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  /**
   * Resource file upload for admin
   * - PDF and DOCX
   * - Max 8MB
   * - Requires admin user
   */
  resourceFile: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    blob: { maxFileSize: "8MB", maxFileCount: 1 }, // For DOCX
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user || session.user.role !== "admin") {
        throw new UploadThingError("Unauthorized - admin access required");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
