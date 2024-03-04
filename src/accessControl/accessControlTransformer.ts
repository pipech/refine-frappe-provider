import { type CanParams } from "@refinedev/core";

import { type FpCanParams } from "./accessControlType";
import { isPermissionType } from "./accessControlTypeHelper";

export const tCanParams = (params: CanParams): FpCanParams => {
  const {
    action,
    params: canParams = {},
    resource,
  } = params;

  const { id = "" } = canParams;

  if (!resource) {
    throw new TypeError("Resource is required");
  }

  if (!isPermissionType(action)) {
    throw new TypeError("Invalid action");
  }

  return {
    docname: id,
    doctype: resource,
    perm_type: action,
  };
};
