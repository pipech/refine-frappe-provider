# Integration for Frappe Framework with Refine

The `refine-frappe-provider` serves as a comprehensive data, access control, and authentication provider for Refine, facilitating effortless integration with the Frappe Framework.

**[Frappe](https://frappeframework.com)** is a full stack, batteries-included, web framework written in Python and Javascript.

**[Refine](https://refine.dev)** is a React-based framework for building internal tools, rapidly.

## Install

```bash
npm i refine-frappe-provider
```

## Usage

```tsx
// App.tsx

import { Refine } from "@refinedev/core";

import {
  accessControlProvider,
  authProvider,
  dataProvider,
  type ClientParams,
} from "refine-frappe-provider";

const providerConfig = {
  url: 'https://frappe-server-url.com',
} satisfies ClientParams;

const App = () => (
  <Refine
    /* ... */
    accessControlProvider={
      accessControlProvider(providerConfig)
    }
    authProvider={
      authProvider(providerConfig)
    }
    dataProvider={
      dataProvider(providerConfig)
    }
  />
);
```

## Important Notes

- Ensure that the response from the Frappe server is configured to set cookies correctly on the Refine site. This requires proper configuration of Cross-Origin Resource Sharing ([CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) settings.


- Since response from `Frappe` server have to set cookies in `Refine` site,  need to be set properly.

## License

This project is licensed under the [MIT](./license) License.
