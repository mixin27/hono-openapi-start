import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { v4 as uuid4 } from "uuid";

export const tasksTable = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => uuid4()),
  name: text().notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasksTable);
export const insertTaskSchema = createInsertSchema(tasksTable, {
  name: schema => schema.name.min(1).max(255),
})
  .required({ done: true })
  .omit({
    id: true,
    createdAt: true,
    updateAt: true,
  });
export const updateTaskSchema = createInsertSchema(tasksTable).partial();
