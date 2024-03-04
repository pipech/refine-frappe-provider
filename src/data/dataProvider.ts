import {
  type DataProvider,
} from "@refinedev/core";

import DataClient, { DataParams } from "./dataClient";

const dataProvider = (
  params: DataParams,
): DataProvider => {
  const client = new DataClient(params);

  return {
    create: client.create,
    custom: client.custom,
    deleteOne: client.deleteOne,
    getApiUrl: client.getApiUrl,
    getList: client.getList,
    getMany: client.getMany,
    getOne: client.getOne,
    update: client.update,
  };
};

export default dataProvider;
