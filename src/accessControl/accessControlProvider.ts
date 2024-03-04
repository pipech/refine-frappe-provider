import {
  type AccessControlProvider,
} from "@refinedev/core";

import AccessControlClient, { AccessControlParams } from "./accessControlClient";

const accessControlProvider = (
  params: AccessControlParams,
): AccessControlProvider => {
  const client = new AccessControlClient(params);

  return client.provider();
};

export default accessControlProvider;
