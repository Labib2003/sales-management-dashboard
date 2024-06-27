// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { type InferModel, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { userRoles } from "~/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `sales-management-dashboard_${name}`,
);

export const roleEnum = pgEnum("role_enum", userRoles);

export const users = createTable(
  "user",
  {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    password: varchar("password", { length: 256 }).notNull(),
    role: roleEnum("role").notNull(),
    active: boolean("active").default(true).notNull(),
    profilePicture: varchar("profile_picture", { length: 256 }),
    phone: varchar("phone", { length: 256 }),
    address: varchar("address", { length: 1024 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (example) => ({
    emailIndex: index("email_idx").on(example.email),
  }),
);
