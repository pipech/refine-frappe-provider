import {
  type Pagination,
} from "@refinedev/core";

type FrappePagination = {
  limit_page_start: number;
  limit_page_length: number;
};

export const generatePagination = (props: Pagination | undefined = {}): FrappePagination => {
  const DEFAULT_PAGE_SIZE = 10;
  const DEFAULT_PAGE = 1;

  const {
    current = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
  } = props;

  return {
    limit_page_length: pageSize,
    limit_page_start: (current - 1) * pageSize,
  };
};
