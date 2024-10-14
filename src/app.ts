import configOpenApi from "@/lib/config-openapi";
import createApp from "@/lib/create-app";
import indexRoute from "@/routes/index.route";
import tasksRoute from "@/routes/tasks/tasks.index";

const app = createApp();

const routes = [
  indexRoute,
  tasksRoute,
] as const;

configOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

/**
 * For client side code.
 *
 * Example:
 * ```js
 * import { hc } from "hono/client";
 *
 * import type { AppType } from "@/app";
 *
 * const client = hc<AppType>("http://localhost:9999");
 * ```
 */
export type AppType = typeof routes[number];

export default app;
