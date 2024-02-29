import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
} from "axios";

export interface ClientParams {
  url: string;
  axiosConfig: Partial<CreateAxiosDefaults>;
}

export class Client {
  url: string;
  instance: AxiosInstance;

  constructor(params: ClientParams) {
    const {
      axiosConfig,
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
  }
}
