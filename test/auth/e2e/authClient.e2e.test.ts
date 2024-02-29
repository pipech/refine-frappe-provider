import {
  describe,
  expect,
  it,
} from "@jest/globals";

import { AuthClient } from "@/auth";
import { AxiosCookieJar, getConfig } from "test/helper";

const config = getConfig();
const { pwd, url, usr } = config;

const authParams = {
  url,
};
const authClient = new AuthClient(authParams);
const jar = new AxiosCookieJar(authClient);

describe("happy auth path", () => {
  it("successfully login", async () => {
    const r = await authClient.login({
      pwd,
      usr,
    });

    expect(r.success).toBe(true);

    const full_name = await jar.getCookie("full_name");
    expect(full_name).toBe("Administrator");
  });

  it("successfully check", async () => {
    const r = await authClient.check({});

    expect(r.authenticated).toBe(true);
  });

  it("successfully logout", async () => {
    const r = await authClient.logout({});

    expect(r.success).toBe(true);

    const cookies = await jar.getCookies();
    expect(cookies.length).toBe(0);
  });
});

describe("unhappy auth path", () => {
  it("login return false on incorrect pwd", async () => {
    const r = await authClient.login({
      pwd: "incorrect-password",
      usr,
    });

    expect(r.success).toBe(false);
    expect(r.error?.message).toBe("Invalid login credentials");

    const cookies = await jar.getCookies();
    expect(cookies.length).toBe(0);
  });

  it("check return false on guest", async () => {
    const r = await authClient.check({});

    expect(r.authenticated).toBe(false);
  });
});
