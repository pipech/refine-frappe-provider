import {
  PermissionType,
} from "./accessControlType";

export const isPermissionType = (value: string): value is PermissionType => value in PermissionType;
