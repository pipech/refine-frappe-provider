import {
  type HttpError,
} from "@refinedev/core";

import { isHttpError } from "@/utils";

type handleUnkownErrorParams = {
  error: unknown;
  errorWhile?: string;
};

export const handleUnkownError = (
  params: handleUnkownErrorParams,
): Error | HttpError => {
  const { error, errorWhile } = params;

  if (isHttpError(error)) {
    return error;
  }

  if (errorWhile) {
    return new Error(
      `An unknown error occurred while ${errorWhile}.`,
    );
  }

  return new Error("An unknown error occurred.");
};
