import {
  describe,
  expect,
  it,
  beforeEach,
} from "@jest/globals";
import nock from "nock";

import { AuthClient } from "@/auth";
import { HttpStatusCode } from "@/utils";

const url = "https://nock-server.dev";
const authParams = {
  url,
};
const authClient = new AuthClient(authParams);

describe("login", () => {
  const endpoints = "/api/method/login";

  beforeEach(() => {
    nock.cleanAll();
  });

  it("successfully login", async () => {
    nock(url)
      .post(endpoints, {
        pwd: "admin",
        usr: "administrator",
      })
      .reply(
        HttpStatusCode.Ok, {
          full_name: "Administrator",
          home_page: "/app",
          message: "Logged In",
        },
      );

    const r = await authClient.login({
      pwd: "admin",
      usr: "administrator",
    });

    expect(r.success).toBe(true);
  });

  it("incorrect credentials", async () => {
    nock(url)
      .post(endpoints, {
        pwd: "incorrect-password",
        usr: "hello@email.com",
      })
      .reply(
        HttpStatusCode.Unauthorized, {
          exception: "frappe.exceptions.AuthenticationError",
          message: "Invalid login credentials",
        },
      );

    const r = await authClient.login({
      pwd: "incorrect-password",
      usr: "hello@email.com",
    });

    expect(r.success).toBe(false);
    expect(r.error?.message).toEqual("Invalid login credentials");
  });
});
