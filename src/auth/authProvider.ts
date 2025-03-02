import {
  type AuthProvider,
} from "@refinedev/core";

import AuthClient, { AuthParams } from "./authClient";

const authProvider = (
  params: AuthParams,
): AuthProvider => {
  const client = new AuthClient(params);

  return client.provider();
};

export default authProvider;
