import { wrapper } from "axios-cookiejar-support";
import { CookieJar as ToughCookieJar } from "tough-cookie";

import { Client } from "@/client";

export class AxiosCookieJar {
  /** Wrap around Client to presist cookies
  * between call for e2e testing */

  jar: ToughCookieJar;
  client: Client;
  url: string;

  constructor(client: Client) {
    this.client = client;
    this.url = client.url;
    this.jar = new ToughCookieJar();

    this.wrapCookiesJar(client);
  }

  wrapCookiesJar(client: Client) {
    client.instance = wrapper(client.instance);
    client.instance.defaults.jar = this.jar;
  }

  getCookies() {
    return this.jar.getCookies(this.url);
  }

  async getCookie(name: string): Promise<null | string> {
    const cookies = await this.getCookies();
    const cookie = cookies.find((c) => c.key === name);
    if (cookie) {
      return cookie.value;
    }
    return null;
  }
}
