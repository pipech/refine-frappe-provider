import { type AuthProvider } from "@refinedev/core";
import { isAxiosError } from "axios";

import { Client, ClientParams } from "@/client";
import { HttpStatusCode } from "@/utils";

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
  error: Error;
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
        withCredentials: true,
      });

      return {
        redirectTo,
        success: true,
      };
    }
    catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          return {
            error: new Error("Invalid username or password."),
            success: false,
          };
        }
      }

      return {
        error: new Error("An unknown error occurred while logging in."),
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
        withCredentials: true,
      });

      return {
        redirectTo,
        success: true,
      };
    }
    catch (error: unknown) {
      return {
        error: new Error("An unknown error occurred while logging out."),
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
      if (isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.Forbidden) {
          return {
            authenticated: false,
            error: new Error("Not logged in."),
          };
        }
      }

      return {
        authenticated: false,
        error: new Error("An unknown error occurred while checking credentials."),
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onError(error: unknown): Promise<OnErrorResponse> {
    const response: OnErrorResponse = {};
    if (error instanceof Error) {
      response.error = error;
    }

    return Promise.resolve(response);
  }
}

export default AuthClient;
