## Why don't I extends ClientParams ?

I'm not sure why `extends ClientParams` doesn't work
and result in `Object literal may only specify known properties, and 'url' does not exist in type 'UploadFileProps'.ts(2353)`.

Could be typescript config error? No idea.

So I just specifically declare using type from ClientParams.

```ts
import { type ClientParams } from "@/client";

// HOTFIX
interface UploadFileProps {
  url: ClientParams["url"];
  axiosConfig?: ClientParams["axiosConfig"];
}

// Doesn't work, don't know why.
interface UploadFileProps extends ClientParams {}
```
