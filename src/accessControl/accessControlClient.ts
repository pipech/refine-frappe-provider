import {
  type CanParams,
  type CanReturnType,
  type AccessControlProvider,
  type IAccessControlContext,
} from "@refinedev/core";

import { Client, ClientParams } from "@/client";

import { tCanParams } from "./accessControlTransformer";

export type AccessControlParams = ClientParams;

class AccessControlClient extends Client {
  provider(
    props: Pick<IAccessControlContext, "options"> = {},
  ): AccessControlProvider {
    const { options } = props;

    return {
      can: this.can,
      options,
    };
  }

  can = async (params: CanParams): Promise<CanReturnType> => {
    try {
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
    }
    catch (error: unknown) {
      return {
        can: false,
      };
    }
  };
}

export default AccessControlClient;
