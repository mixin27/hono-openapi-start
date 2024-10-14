/* eslint-disable ts/ban-ts-comment */
import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { ZodIssueCode } from "zod";

import env from "@/env";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import createApp, { createTestApp } from "@/lib/create-app";
import * as HttpStatusPhrases from "@/stoker/http-status-phrases";

import router from "./tasks.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", router));

describe("tasks list", () => {
  beforeAll(async () => {
    execSync("bunx drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true, retryDelay: 1000 });
  });

  it("post /tasks validates the body when creating", async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error
      json: {
        done: false,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const id = "1c388e4b-dd52-4d09-aeab-1d3a6f0ae721";
  const wrongId = "1c388e4b-dd52-4d09-aeab-1d3a6f0ae722";
  const name = "Learn vitest";

  it("post /tasks creates a task", async () => {
    const response = await client.tasks.$post({
      json: {
        name,
        done: false,
      },
    });
    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it("get /tasks lists all tasks", async () => {
    const response = await client.tasks.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();

      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it("get /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_UUID);
    }
  });

  it("get /tasks/{id} returns 404 when task not found", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: wrongId,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /tasks/{id} gets a single task", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });
});
