import {
  CrudSorting,
} from "@refinedev/core";

export const generateSort = (sorters?: CrudSorting): string | undefined => {
  if (!(sorters && sorters.length > 0)) {
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  const sorterList = sorters.map((item) => `${item.field} ${item.order}`);

  return sorterList.join(",");
};
