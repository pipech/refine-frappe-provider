import {
  type AuthProvider,
} from "@refinedev/core";

import AuthClient, { AuthParams } from "./authClient";

const authProvider = (
  params: AuthParams,
): AuthProvider => {
  const client = new AuthClient(params);

  return {
    check: client.check,
    login: client.login,
    logout: client.logout,
    onError: client.onError,
  };
};

export default authProvider;
