import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const opportunity = pgTable(
  "opportunity",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: text("type", {
      enum: ["internship", "fellowship", "volunteer"],
    }).notNull(),
    mode: text("mode", { enum: ["remote", "onsite", "hybrid"] }).notNull(),
    location: text("location"),
    category: text("category").notNull(), // e.g., engineering, design, marketing, business, data-science
    skills: text("skills").array().default([]),
    stipend: integer("stipend"), // Monthly stipend in NPR, null = unpaid
    duration: text("duration"), // e.g., "3 months", "6 months"
    deadline: timestamp("deadline").notNull(),
    positions: integer("positions").default(1).notNull(),
    status: text("status", {
      enum: ["draft", "published", "closed", "archived"],
    })
      .default("draft")
      .notNull(),
    recruiterId: text("recruiter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("opportunity_recruiter_idx").on(table.recruiterId),
    index("opportunity_status_idx").on(table.status),
    index("opportunity_category_idx").on(table.category),
    index("opportunity_deadline_idx").on(table.deadline),
  ],
);

// Relations will be defined after all tables are created
