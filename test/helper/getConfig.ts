import * as fs from "fs";

export type ProviderTestConfig = {
  url: string;
  usr: string;
  pwd: string;
};

export const getConfig = () => {
  try {
    const rawData = fs.readFileSync("./providerTestConfig.json", "utf8");
    const config: ProviderTestConfig = JSON.parse(rawData);
    return config;
  }
  catch (error) {
    // eslint-disable-next-line no-console, no-undef
    console.log(error);
    throw new Error("Failed to load configuration, please create `providerTestConfig.json` on root directory.");
  }
};
