import {
  type BaseKey,
} from "@refinedev/core";

/**
 * Frappe has_permission api required docname params
 * but it's actuall optional params.
 *
 * For example, user can has read permission
 * only if user is owner.
 */
export enum PermissionType {
  read = "read",
  write = "write",
  submit = "submit",
  cancel = "cancel",
  report = "report",
  create = "create",
  delete = "delete",
}

export interface FpCanParams {
  docname: BaseKey | "";
  doctype: string;
  perm_type: PermissionType;
}
