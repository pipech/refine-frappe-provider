import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
} from "axios";

import { parseError } from "./utils";

export interface ClientParams {
  url: string;
  axiosConfig?: Partial<CreateAxiosDefaults>;
}

export class Client {
  url: string;
  instance: AxiosInstance;

  constructor(params: ClientParams) {
    const {
      axiosConfig = {},
      url,
    } = params;
    const {
      headers,
      ...restAxiosConfig
    } = axiosConfig;

    this.url = url;
    this.instance = axios.create({
      baseURL: url,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      withCredentials: true,
      ...restAxiosConfig,
    });

    this.instance.interceptors.response.use(
      (response) => {
        if ("message" in response.data) {
          response.data = response.data.message;
        }
        else if (Object.keys(response.data).length === 1 && "data" in response.data) {
          response.data = response.data.data;
        }

        return response;
      },
      (error) => {
        const httpError = parseError(error);
        return Promise.reject(httpError);
      },
    );
  }
}
