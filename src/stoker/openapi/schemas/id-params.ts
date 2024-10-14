import { z } from "@hono/zod-openapi";

const numberParamsIdSchema = z.coerce.number().openapi({
  param: {
    name: "id",
    in: "path",
  },
  required: ["id"],
  example: 42,
});

const IdParamsSchema = z.object({ id: numberParamsIdSchema });

export default IdParamsSchema;
