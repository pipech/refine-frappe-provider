import {
  HttpError,
  type AuthProvider,
} from "@refinedev/core";

export type AuthActionSuccessResponse = {
  success: true;
  redirectTo?: string;
  error?: never;
};
export type AuthActionFailureResponse = {
  success: false;
  redirectTo?: string;
  error: Error | HttpError;
};
export type AuthActionResponse = AuthActionSuccessResponse | AuthActionFailureResponse;

export type LoginParams = {
  usr: string;
  pwd: string;
  redirectTo?: string;
};

export type LogoutParams = {
  redirectTo?: string;
};

export type CheckParams = {
  redirectTo?: string;
};

export type CheckResponse = Awaited<ReturnType<AuthProvider["check"]>>;

export type OnErrorResponse = Awaited<ReturnType<AuthProvider["onError"]>>;
