import {
  type DataProvider,
} from "@refinedev/core";

import DataClient, { DataParams } from "./dataClient";

const dataProvider = (
  params: DataParams,
): DataProvider => {
  const client = new DataClient(params);

  return client.provider();
};

export default dataProvider;
