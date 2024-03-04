import {
  describe,
  expect,
  it,
} from "@jest/globals";

import { AccessControlClient } from "@/accessControl";
import { isHttpError } from "@/utils";
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

describe("access control", () => {
  it("can", async () => {
    const { can } = await accessControlClient.can({
      action: "read",
      resource: "Notification Log",
    });

    expect(can).toBe(true);
  });

  it("can't", async () => {
    const { can } = await accessControlClient.can({
      action: "create",
      resource: "Notification Log",
    });

    expect(can).toBe(false);
  });

  it("not exist ", async () => {
    try {
      await accessControlClient.can({
        action: "read",
        params: {
          id: "1",
        },
        resource: "Notification Log",
      });
    }
    catch (error) {
      expect(isHttpError(error)).toBe(true);
      // @ts-expect-error
      expect(error.message).toBe("Not Found");
      // @ts-expect-error
      expect(error.statusCode).toBe(404);
    }
  });
});
