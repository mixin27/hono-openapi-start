import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app";
import * as HttpStatusCodes from "@/stoker/http-status-codes";
import { jsonContent } from "@/stoker/openapi/helpers";
import { createMessageObjectSchema } from "@/stoker/openapi/schemas";

const router = createRouter().openapi(createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Online Store API"),
      "Online Store API index.",
    ),
  },
}), (c) => {
  return c.json({ message: "Online Store API" }, HttpStatusCodes.OK);
});

export default router;
