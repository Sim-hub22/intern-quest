import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { opportunity } from "./opportunity";

export const application = pgTable(
  "application",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunity.id, { onDelete: "cascade" }),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    coverLetter: text("cover_letter"),
    resumeUrl: text("resume_url"), // Can differ from profile resume
    status: text("status", {
      enum: [
        "pending",
        "reviewing",
        "shortlisted",
        "accepted",
        "rejected",
        "withdrawn",
      ],
    })
      .default("pending")
      .notNull(),
    appliedAt: timestamp("applied_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("application_opportunity_idx").on(table.opportunityId),
    index("application_candidate_idx").on(table.candidateId),
    unique("application_unique_constraint").on(
      table.opportunityId,
      table.candidateId,
    ),
  ],
);

export const applicationRelations = relations(application, ({ one }) => ({
  opportunity: one(opportunity, {
    fields: [application.opportunityId],
    references: [opportunity.id],
  }),
  candidate: one(user, {
    fields: [application.candidateId],
    references: [user.id],
  }),
}));
