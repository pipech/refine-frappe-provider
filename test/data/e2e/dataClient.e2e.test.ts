import {
  describe,
  expect,
  it,
} from "@jest/globals";

import { DataClient } from "@/data";
import { getConfig } from "test/helper";

const config = getConfig();
const { token, url } = config;

const dataParams = {
  axiosConfig: {
    headers: {
      Authorization: `token ${token}`,
    },
  },
  url,
};
const dataClient = new DataClient(dataParams);

describe("use token", () => {
  it("able to getList", async () => {
    const r = await dataClient.getList({
      resource: "User",
    });

    expect(r.total).toBeGreaterThan(0);
  });
});
