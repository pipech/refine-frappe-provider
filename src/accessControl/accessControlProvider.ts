import {
  type AccessControlProvider,
} from "@refinedev/core";

import AccessControlClient, {
  type AccessControlParams,
  type AccessControlProviderParams,
} from "./accessControlClient";

const accessControlProvider = (
  params: AccessControlParams & AccessControlProviderParams,
): AccessControlProvider => {
  const {
    options = {},
    ...clientParams
  } = params;

  const client = new AccessControlClient(clientParams);

  return client.provider({ options });
};

export default accessControlProvider;
