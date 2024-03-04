import {
  describe,
  expect,
  it,
} from "@jest/globals";

import { AuthClient } from "@/auth";
import { DataClient } from "@/data";
import { isHttpError } from "@/utils";
import { AxiosCookieJar, getConfig } from "test/helper";

const config = getConfig();
const { pwd, token, url, usr } = config;

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
    const { data, total } = await dataClient.getList({
      resource: "User",
    });

    expect(total).toBeGreaterThan(0);
    expect(data.length).toBeGreaterThan(0);
  });

  it("able to getMany", async () => {
    const { data } = await dataClient.getMany({
      ids: [usr],
      resource: "User",
    });

    expect(data).toEqual([{ name: usr }]);
  });

  it("able to getOne", async () => {
    const { data } = await dataClient.getOne({
      id: usr,
      resource: "User",
    });

    expect(data).toMatchObject({ name: usr });
  });
});

describe("crud", () => {
  let id = "";

  it("able to create", async () => {
    const { data } = await dataClient.create({
      resource: "ToDo",
      variables: {
        description: "Hello unittest",
      },
    });

    id = data.name;

    expect(data).toMatchObject({ description: "Hello unittest" });
  });

  it("able to update", async () => {
    const { data } = await dataClient.update({
      id,
      resource: "ToDo",
      variables: {
        description: "Hello unittest updated",
      },
    });

    expect(data).toMatchObject({ description: "Hello unittest updated" });
  });

  it("able to delete", async () => {
    const { data } = await dataClient.deleteOne({
      id,
      resource: "ToDo",
    });

    expect(data).toMatchObject({ id });

    try {
      await dataClient.getOne({
        id,
        resource: "ToDo",
      });
    }
    catch (error) {
      // @ts-expect-error
      expect(error.statusCode).toBe(404);
      // @ts-expect-error
      expect(error.message).toBe("Not Found");
    }
  });

  it("able to call custom", async () => {
    const { data } = await dataClient.custom({
      method: "get",
      payload: {
        doctype: "User",
        name: usr,
      },
      url: "/api/method/frappe.client.get",
    });

    expect(data).toMatchObject({ name: usr });
  });
});

const noAuthDataParams = {
  url,
};
const dataNoAuthClient = new DataClient(noAuthDataParams);

describe("no auth", () => {
  it("able to getList", async () => {
    try {
      await dataNoAuthClient.getList({
        resource: "User",
      });
    }
    catch (error) {
      expect(isHttpError(error)).toBe(true);
      // @ts-expect-error
      expect(error.message).toBe("Forbidden");
      // @ts-expect-error
      expect(error.statusCode).toBe(403);
    }
  });
});

const withCookiesParams = {
  url,
};
const dataCookiesClient = new DataClient(withCookiesParams);
const authCookiesClient = new AuthClient(withCookiesParams);

const jar = new AxiosCookieJar(dataCookiesClient);
jar.wrapCookiesJar(authCookiesClient);

describe("use cookies", () => {
  it("successfully login", async () => {
    const r = await authCookiesClient.login({
      pwd,
      usr,
    });

    expect(r.success).toBe(true);
  });

  it("get data using cookies", async () => {
    const { data, total } = await dataCookiesClient.getList({
      resource: "User",
    });
    expect(total).toBeGreaterThan(0);
    expect(data.length).toBeGreaterThan(0);
  });
});
