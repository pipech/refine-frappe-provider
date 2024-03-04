import { type HttpError } from "@refinedev/core";

export const isHttpError = (error: unknown): error is HttpError => (
  typeof error === "object"
  && error !== null
  && "message" in error
  && "statusCode" in error
);
