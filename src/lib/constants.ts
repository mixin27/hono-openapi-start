import * as HttpStatusPhrases from "@/stoker/http-status-phrases";
import { createMessageObjectSchema } from "@/stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
export const notFoundMessage = { message: HttpStatusPhrases.NOT_FOUND };

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  EXPECTED_UUID: "Invalid Id",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};
