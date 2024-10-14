import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { tasksTable } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";
import * as HttpStatusCodes from "@/stoker/http-status-codes";

import type { CreateRoute, GetByIdRoute, ListRoute, RemoveRoute, UpdateRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasksTable.findMany();

  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const [createdTask] = await db.insert(tasksTable).values(task).returning();
  return c.json(createdTask, HttpStatusCodes.CREATED);
};

export const getById: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const task = await db.query.tasksTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task)
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);

  return c.json(task, HttpStatusCodes.OK);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [task] = await db.update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, id))
    .returning();

  if (!task) {
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(tasksTable).where(eq(tasksTable.id, id));

  if (result.rowsAffected === 0) {
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(null, HttpStatusCodes.NO_CONTENT);
};
