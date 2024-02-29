import {
  type CanParams,
  type CanReturnType,
} from "@refinedev/core";

import { Client, ClientParams } from "@/client";

export type AccessControlParams = ClientParams;

class AccessControlClient extends Client {
  async can(params: CanParams): Promise<CanReturnType> {
    const {
      action,
      params: canParams,
      resource,
    } = params;

    const { id } = canParams || {};

    const {
      data: { has_permission },
    } = await this.instance.request<{
      has_permission: boolean;
    }>({
      method: "GET",
      params: {
        docname: id,
        doctype: resource,
        perm_type: action,
      },
      url: "/api/method/frappe.client.has_permission",
    });

    return {
      can: has_permission,
    };
  }
}

export default AccessControlClient;
