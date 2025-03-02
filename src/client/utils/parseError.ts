/* eslint-disable
  no-underscore-dangle,
  no-empty,
  @typescript-eslint/no-explicit-any
  */

import {
  type HttpError,
} from "@refinedev/core";
import {
  isAxiosError,
  HttpStatusCode,
  type AxiosResponse,
} from "axios";

const isAxiosResponse = (response: unknown): response is AxiosResponse => (
  typeof response === "object"
  && response !== null
  && "data" in response
);

type JSONPrimitive = string | number | boolean | null | undefined;

/**
 * based on frappe/frappe/utils/response.py
 * ref: https://github.com/frappe/frappe/blob/16d74c1db4f2fc694716ab43a92adc45af4ad6a3/frappe/utils/response.py#L173-L201
 */
interface FrappeErrResponseV1 {
  exc?: string;
  _exc_source?: string;
  _server_messages?: string;
  _debug_messages?: string;
  _error_message?: string;
}
const isFrappeErrResponseV1 = (response: unknown): response is FrappeErrResponseV1 => (
  typeof response === "object"
  && response !== null
  && (
    "exc" in response
    || "_exc_source" in response
    || "_server_messages" in response
    || "_debug_messages" in response
    || "_error_message" in response
  )
);
interface FrappeErrResponseV2 {
  messages?: string;
  debug?: string;
}
const isFrappeErrResponseV2 = (response: unknown): response is FrappeErrResponseV2 => (
  typeof response === "object"
  && response !== null
  && (
    "messages" in response
    || "debug" in response
  )
);

/**
 * Based on server's code, server message should be
 * String(List of String(Object))
 *
 * ```python
 * response["_server_messages"] = json.dumps([json.dumps(d) for d in frappe.local.message_log])
 * ```
 *
 * ref: https://github.com/frappe/frappe/blob/16d74c1db4f2fc694716ab43a92adc45af4ad6a3/frappe/utils/response.py#L185
 */
const parseFrappeServerMsg = (s: unknown): Record<string, JSONPrimitive>[] | false => {
  try {
    if (typeof s === "string") {
      return JSON.parse(s).map((d: any) => JSON.parse(d));
    }
  }
  catch (e) { }

  return false;
};

/**
 * based on frappe/frappe/__init__.py
 * ref: https://github.com/frappe/frappe/blob/16d74c1db4f2fc694716ab43a92adc45af4ad6a3/frappe/__init__.py#L556-L646
 */
interface FrappeMsgLog {
  message: string;
  title?: string;
  indicator?: string;
}
const isFrappeMsgLog = (v: unknown): v is FrappeMsgLog => (
  typeof v === "object"
  && v !== null
  && "message" in v
);

const parseError = (error: unknown): HttpError => {
  const defaultMessage = "Error, something went wrong. Please try again later.";
  const defaultStatusCode = HttpStatusCode.InternalServerError;

  if (!isAxiosError(error) || !isAxiosResponse(error?.response)) {
    return {
      message: defaultMessage,
      statusCode: defaultStatusCode,
    };
  }

  const { response } = error;
  const {
    data,
    status: statusCode,
  } = response;

  if (isFrappeErrResponseV1(data)) {
    if ("_server_messages" in data) {
      const serverMessage = parseFrappeServerMsg(data._server_messages);
      if (
        serverMessage
        && serverMessage.length >= 1
        && isFrappeMsgLog(serverMessage[0])
      ) {
        return {
          message: serverMessage[0].message,
          statusCode,
        };
      }
    }

    if ("_error_message" in data && data._error_message) {
      /**
       * Based on server's code, server message should be `string`
       *
       * ```python
       * response['_error_message'] = frappe.flags.error_message
       * ```
       *
       * ref: https://github.com/frappe/frappe/blob/16d74c1db4f2fc694716ab43a92adc45af4ad6a3/frappe/utils/response.py#L191C13-L191C27
       */

      return {
        message: data._error_message,
        statusCode,
      };
    }

    return {
      message: defaultMessage,
      statusCode,
    };
  }

  if (isFrappeErrResponseV2(response)) {
    if (response.messages) {
      /**
       * Based on server's code, server message should be object of frappeMsgLog.
       *
       * ```python
       * response["messages"] = frappe.local.message_log
       * ```
       *
       * ref: https://github.com/frappe/frappe/blob/16d74c1db4f2fc694716ab43a92adc45af4ad6a3/frappe/utils/response.py#L198C26-L198C50
       */
      const { messages } = response;

      if (
        messages
        && messages.length >= 1
        && isFrappeMsgLog(messages[0])
      ) {
        return {
          message: messages[0].message,
          statusCode,
        };
      }

      return {
        message: response.messages,
        statusCode,
      };
    }

    return {
      message: defaultMessage,
      statusCode,
    };
  }

  // last resort before default
  if (error?.message) {
    return {
      message: error.message,
      statusCode,
    };
  }
  if (error?.code) {
    return {
      message: error.code,
      statusCode,
    };
  }

  return {
    message: defaultMessage,
    statusCode,
  };
};

export { parseError };
