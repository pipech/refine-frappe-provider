import {
  type CanParams,
  type CanReturnType,
} from "@refinedev/core";

import { Client, ClientParams } from "@/client";

import { tCanParams } from "./accessControlTransformer";

export type AccessControlParams = ClientParams;

class AccessControlClient extends Client {
  provider() {
    return {
      can: this.can,
    };
  }

  can = async (params: CanParams): Promise<CanReturnType> => {
    const fpParams = tCanParams(params);

    const {
      data: { has_permission },
    } = await this.instance.request<{
      has_permission: boolean;
    }>({
      method: "GET",
      params: fpParams,
      url: "/api/method/frappe.client.has_permission",
    });

    return {
      can: Boolean(has_permission),
    };
  };
}

export default AccessControlClient;
