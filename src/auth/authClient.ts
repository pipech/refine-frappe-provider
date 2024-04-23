import { type AuthProvider } from "@refinedev/core";

import { Client, ClientParams } from "@/client";
import { handleUnkownError } from "@/utils";

import {
  AuthActionResponse,
  LoginParams,
  LogoutParams,
  CheckParams,
  CheckResponse,
  OnErrorResponse,
} from "./authType";

export type AuthParams = ClientParams;

class AuthClient extends Client {
  provider(): AuthProvider {
    return {
      check: this.check,
      login: this.login,
      logout: this.logout,
      onError: this.onError,
    };
  }

  login = async (params: LoginParams): Promise<AuthActionResponse> => {
    const { pwd, redirectTo = "/", usr } = params;

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
        redirectTo,
        success: false,
      };
    }
  };

  logout = async (params: LogoutParams): Promise<AuthActionResponse> => {
    const { redirectTo = "/" } = params || {};

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
  };

  check = async (params?: CheckParams): Promise<CheckResponse> => {
    const { redirectTo = "/" } = params || {};

    try {
      /**
       * `get_logged_user` method doesn't allow Guest
       * if it's calling by Guest it will response with 403
       * so we skip it and just return false
       */
      if (
        typeof document !== "undefined"
        && typeof document.cookie === "string"
        && (
          document.cookie === ""
          || document.cookie.includes("user_id=Guest")
        )
      ) {
        return {
          authenticated: false,
          redirectTo,
        };
      }

      await this.instance.request({
        method: "GET",
        url: "/api/method/frappe.auth.get_logged_user",
      });

      return {
        authenticated: true,
        redirectTo,
      };
    }
    catch (error: unknown) {
      return {
        authenticated: false,
        redirectTo,
      };
    }
  };

  // eslint-disable-next-line class-methods-use-this
  onError = (error: unknown): Promise<OnErrorResponse> => {
    const response: OnErrorResponse = {
      error: handleUnkownError({
        error,
      }),
    };

    return Promise.resolve(response);
  };
}

export default AuthClient;
