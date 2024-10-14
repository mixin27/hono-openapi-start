import { createRoute, z } from "@hono/zod-openapi";

import { insertTaskSchema, selectTasksSchema, updateTaskSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";
import * as HttpStatusCodes from "@/stoker/http-status-codes";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "@/stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema, UuidIdParamsSchema } from "@/stoker/openapi/schemas";

const tags = ["Tasks"];

export const list = createRoute({
  tags,
  path: "/tasks",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectTasksSchema),
      "The list of tasks.",
    ),

  },
});

export const create = createRoute({
  tags,
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertTaskSchema,
      "The task to create.",
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTasksSchema,
      "The created task.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertTaskSchema),
      "The validation error(s).",
    ),
  },
});

export const getById = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: UuidIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The requested task by id.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UuidIdParamsSchema),
      "The validation error(s).",
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: UuidIdParamsSchema,
    body: jsonContentRequired(
      updateTaskSchema,
      "The task to update.",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTasksSchema,
      "The updated task.",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [createErrorSchema(updateTaskSchema), createErrorSchema(UuidIdParamsSchema)],
      "The validation error(s).",
    ),
  },
});

export const remove = createRoute({
  tags,
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: UuidIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Task deleted.",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UuidIdParamsSchema),
      "The validation error(s).",
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetByIdRoute = typeof getById;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
