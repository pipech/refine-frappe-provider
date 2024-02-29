import axios, { type AxiosInstance } from "axios";

export interface ClientParams {
  url: string;
}

export class Client {
  url: string;
  instance: AxiosInstance;

  constructor(params: ClientParams) {
    const { url } = params;

    this.url = url;
    this.instance = axios.create({
      baseURL: url,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });
  }
}
