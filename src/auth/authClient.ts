import {
  HttpError,
  type AuthProvider,
} from "@refinedev/core";

import { Client, ClientParams } from "@/client";
import { handleUnkownError } from "@/utils";

export type AuthParams = ClientParams;

/**
 * --------------------------------------------------
 * AuthAction
 * --------------------------------------------------
 */

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

/**
 * --------------------------------------------------
 * Login
 * --------------------------------------------------
 */

export type LoginParams = {
  usr: string;
  pwd: string;
  redirectTo?: string;
};

/**
 * --------------------------------------------------
 * Logout
 * --------------------------------------------------
 */

export type LogoutParams = {
  redirectTo?: string;
};

/**
 * --------------------------------------------------
 * Check
 * --------------------------------------------------
 */

export type CheckParams = {
  redirectTo?: string;
};

export type CheckResponse = Awaited<ReturnType<AuthProvider["check"]>>;

/**
 * --------------------------------------------------
 * OnError
 * --------------------------------------------------
 */

export type OnErrorResponse = Awaited<ReturnType<AuthProvider["onError"]>>;

/**
 * **************************************************
 * Client
 * **************************************************
 */

class AuthClient extends Client {
  async login(params: LoginParams): Promise<AuthActionResponse> {
    const { pwd, redirectTo, usr } = params;

    try {
      await this.instance.request({
        data: {
          pwd,
          usr,
        },
        method: "POST",
        url: "/api/method/login",
      });

      return {
        redirectTo,
        success: true,
      };
    }
    catch (error: unknown) {
      return {
        error: handleUnkownError({
          error,
          errorWhile: "logging in",
        }),
        success: false,
      };
    }
  }

  async logout(params: LogoutParams): Promise<AuthActionResponse> {
    const { redirectTo } = params;

    try {
      await this.instance.request({
        method: "POST",
        url: "/api/method/logout",
      });

      return {
        redirectTo,
        success: true,
      };
    }
    catch (error: unknown) {
      return {
        error: handleUnkownError({
          error,
          errorWhile: "logging out",
        }),
        redirectTo,
        success: false,
      };
    }
  }

  async check(params: CheckParams): Promise<CheckResponse> {
    const { redirectTo } = params;

    try {
      await this.instance.post(
        "/api/method/frappe.auth.get_logged_user",
      );

      return {
        authenticated: true,
        redirectTo,
      };
    }
    catch (error: unknown) {
      return {
        authenticated: false,
        error: handleUnkownError({
          error,
          errorWhile: "checking authentication",
        }),
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onError(error: unknown): Promise<OnErrorResponse> {
    const response: OnErrorResponse = {
      error: handleUnkownError({
        error,
      }),
    };

    return Promise.resolve(response);
  }
}

export default AuthClient;
