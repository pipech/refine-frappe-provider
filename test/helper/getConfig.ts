import * as fs from "fs";

export type ProviderTestConfig = {
  /**
   * URL of the Frappe server
   * @example "https://example.com"
   */
  url: string;

  /**
   * Username to login to the Frappe server
   * should be non-admin, with `System Manager` role
   * @example "test@e2e.com"
   */
  usr: string;
  /**
   * Password to login to the Frappe server
   * @example "p@55W()rd"
   */
  pwd: string;

  /**
   * Token of administrator of the Frappe server
   * should be non-admin, with `System Manager` role
   * @example "5e4594664747d01:6604a01e77049a5"
   */
  token: string;
};

export const getConfig = () => {
  try {
    const rawData = fs.readFileSync("./providerTestConfig.json", "utf8");
    const config: ProviderTestConfig = JSON.parse(rawData);
    return config;
  }
  catch (error) {
    // eslint-disable-next-line no-console, no-undef
    console.error(error);
    throw new Error("Failed to load configuration, please create `providerTestConfig.json` on root directory.");
  }
};
