import {
  type CrudFilter,
  type CrudFilters,
  type CrudOperators,
} from "@refinedev/core";

type FrappeFilter = [string, string, string];
type FilterResponse = FrappeFilter[];

const OPERATOR_MAP = {
  between: "between",
  contains: "like",
  eq: "=",
  gt: ">",
  gte: ">=",
  in: "in",
  lt: "<",
  lte: "<=",
  ncontains: "not like",
  ne: "!=",
  nin: "not in",
};
const UNSUPPORTED_OPERATORS_MAP = {
  and: null,
  containss: null,
  endswith: null,
  endswiths: null,
  nbetween: null,
  ncontainss: null,
  nendswith: null,
  nendswiths: null,
  nnull: null,
  nstartswith: null,
  nstartswiths: null,
  null: null,
  or: null,
  startswith: null,
  startswiths: null,
};
const CRUD_OPERATORS: Record<CrudOperators, string | null> = {
  ...OPERATOR_MAP,
  ...UNSUPPORTED_OPERATORS_MAP,
};

/**
 * Sanitizes the given value based on the provided operator.
 * If the value is a string, it applies the appropriate sanitization based on the operator.
 * If the value is not a string, it returns the value as is.
 *
 * @param value - The value to be sanitized.
 * @param operator - The operator to determine the type of sanitization to be applied.
 * @returns The sanitized value.
 */
const sanitizeValue = (value: any, operator: CrudOperators): string => {
  if (typeof value === "string") {
    const SanatizationMap: Record<CrudOperators | any, string | undefined> = {
      contains: `%${value}%`,
      ncontains: `%${value}%`,
    };
    return SanatizationMap[operator] ?? value;
  }
  return value;
};

/**
 * Maps a CRUD operator to its corresponding string representation.
 * @param operator - The CRUD operator to map.
 * @returns The string representation of the mapped operator.
 * @throws Error if the provided operator is not supported.
 * @example
 * mapOperator("eq");
 * return: "="
 */
export const mapOperator = (operator: CrudOperators): string => {
  const mappedOperator = CRUD_OPERATORS[operator];
  if (mappedOperator) {
    return mappedOperator;
  }
  throw new Error(
    `[refine-frappe]: \`operator: ${operator}\` is not supported.`
  );
};

/**
 * Transforms a logical filter into a Frappe filter.
 * @param filter - The logical filter to transform.
 * @returns The transformed Frappe filter.
 * @example
 * transformFilter({
 *   field: 'name',
 *   operator: 'equals',
 *   value: 'John Doe'
 * });
 * return: ['name', '=', 'John Doe']
 */
const transformFilter = (filter: CrudFilter): FrappeFilter => {
  if (!("field" in filter)) {
    throw new Error(`[refine-frappe]: \`filter\` must be a logical filter.`);
  }
  const { field, operator, value } = filter;
  const mappedOperator = mapOperator(operator);
  const sanitizedValue = sanitizeValue(value, operator);
  return [field, mappedOperator, sanitizedValue];
};

/**
 * Generates a filter response based on the provided filters.
 * @param filters - The filters to generate the response from only supports andFilter for now
 * @returns The generated filter response.
 * @example
 * generateFilter([
 *   { field: 'name', operator: 'eq', value: 'John' },
 *   { field: 'age', operator: 'gt', value: 18 },
 * ]);
 * return: [
 *   ['name', '=', 'John'],
 *   ['age', '>', 18],
 * ]
 */
export const generateFilter = (filters?: CrudFilters): FilterResponse => {
  // If no filters are provided, return an empty array.
  if (!filters) {
    return [];
  }

  const queryFilters: FilterResponse = [];
  filters.forEach((filter) => {
    queryFilters.push(transformFilter(filter));
  });
  return queryFilters;
};
