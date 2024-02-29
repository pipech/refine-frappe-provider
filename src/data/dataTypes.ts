/* eslint-disable no-magic-numbers */

import { type BaseRecord } from "@refinedev/core";

type Timestamp = string;
type UserId = string;
type DocId = string;
enum DocStatus {
  Draft = 0,
  Submitted = 1,
  Cancelled = 2,
}

export interface BaseDoc {
  name: DocId;

  owner: UserId;
  modified_by: UserId;
  creation: Timestamp;
  modified: Timestamp;
  docstatus: DocStatus;
  doctype: string;
};

export interface ChildDoc extends BaseDoc {
  idx: number;
  parent: string;
  parentfield: string;
  parenttype: string;
};

export type Doc<T extends BaseRecord> = T & BaseDoc;
