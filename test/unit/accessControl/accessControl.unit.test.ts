import {
  describe,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import nock from "nock";

import { AccessControlClient } from "@/accessControl";
import { getConfig } from "test/helper";

const config = getConfig();
const { token, url } = config;

const accessControlParams = {
  axiosConfig: {
    headers: {
      Authorization: `token ${token}`,
    },
  },
  url,
};
const accessControlClient = new AccessControlClient(accessControlParams);

describe("accessControl", () => {
  const endpoints = "/api/method/frappe.client.has_permission";

  beforeEach(() => {
    nock.cleanAll();
  });

  it("can", async () => {
    const params = {
      action: "read",
      resource: "Notification Log",
    };

    nock(url, { encodedQueryParams: true })
      .get(endpoints)
      .query(
        {
          docname: "",
          doctype: "Notification Log",
          perm_type: "read",
        },
      )
      .reply(
        200, { message: { has_permission: 1 } },
      );

    const { can } = await accessControlClient.can(params);

    expect(can).toBe(true);
  });
});
