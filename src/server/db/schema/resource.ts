import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const resource = pgTable(
  "resource",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"), // Plain text article content
    category: text("category").notNull(), // e.g., resume-tips, interview-prep, career-guide, skill-building
    fileUrl: text("file_url"), // UploadThing URL for downloadable file
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("resource_category_idx").on(table.category),
    index("resource_published_idx").on(table.isPublished),
  ],
);

export const resourceDownload = pgTable(
  "resource_download",
  {
    id: text("id").primaryKey(),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resource.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
  },
  (table) => [index("resource_download_resource_idx").on(table.resourceId)],
);

export const resourceRelations = relations(resource, ({ one, many }) => ({
  author: one(user, {
    fields: [resource.authorId],
    references: [user.id],
  }),
  downloads: many(resourceDownload),
}));

export const resourceDownloadRelations = relations(
  resourceDownload,
  ({ one }) => ({
    resource: one(resource, {
      fields: [resourceDownload.resourceId],
      references: [resource.id],
    }),
    user: one(user, {
      fields: [resourceDownload.userId],
      references: [user.id],
    }),
  }),
);
