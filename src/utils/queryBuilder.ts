import {
  IPrismaModelDelegate,
  IQueryConfig,
  IQueryParams,
  IQueryResult,
  IWhereConditions,
  PrismaCountQueryArgs,
  PrismaFindManyArgs,
} from "../types/queryBuilder";

export class QueryBuilder<T, TWhereInput, TInclude> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountQueryArgs;
  private page = 1;
  private limit = 10;
  private selectFields:
    | Record<string, boolean | Record<string, unknown>>
    | undefined;

  constructor(
    private model: IPrismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };
    this.countQuery = {
      where: {},
    };
  }

  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchableCondition: Record<string, unknown>[] =
        searchableFields.map((field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              return {
                [relation!]: {
                  [nestedField!]: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              return {
                [relation!]: {
                  some: {
                    [nestedRelation!]: {
                      [nestedField!]: {
                        contains: searchTerm,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              };
            }
          }
          return {
            [field]: {
              contains: searchTerm,
              mode: "insensitive",
            },
          };
        });

      const queryWhere = this.query.where as IWhereConditions;
      const queryCountWhere = this.countQuery.where as IWhereConditions;

      if (!queryWhere.AND) {
        queryWhere.AND = [];
      }
      queryWhere.AND.push({ OR: searchableCondition });

      if (!queryCountWhere.AND) {
        queryCountWhere.AND = [];
      }
      queryCountWhere.AND.push({ OR: searchableCondition });
    }
    return this;
  }

  filter(): this {
    const { filterableFields } = this.config;
    const excludedFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "include",
      "fields",
    ];
    const filterableConditions: Record<string, unknown> = {};
    for (const key of Object.keys(this.queryParams)) {
      if (!excludedFields.includes(key)) {
        filterableConditions[key] = this.queryParams[key];
      }
    }

    const queryWhere = this.query.where as IWhereConditions;
    const queryCountWhere = this.countQuery.where as IWhereConditions;

    for (const key of Object.keys(filterableConditions)) {
      const value = filterableConditions[key];
      if (value === undefined || value === "") continue;

      const isAllowedField =
        filterableFields && filterableFields.length > 0
          ? filterableFields.includes(key)
          : false;

      if (!isAllowedField) continue;

      if (key.includes(".")) {
        if (filterableFields && !filterableFields.includes(key)) {
          continue;
        }
        const parts = key.split(".");

        if (parts.length === 2) {
          const [relation, nestedField] = parts;

          const searchTerm = {
            [nestedField!]: {
              contains: value,
              mode: "insensitive",
            },
          };

          const parsedValue = this.parsedValue(value);

          if (!queryWhere.AND) {
            queryWhere.AND = [];
          }
          if (!queryCountWhere.AND) {
            queryCountWhere.AND = [];
          }

          if (typeof parsedValue === "string") {
            queryWhere.AND.push({
              [relation!]: searchTerm,
            });
          } else if (typeof parsedValue === "boolean") {
            queryWhere.AND.push({
              [relation!]: {
                [nestedField!]: parsedValue,
              },
            });
          }

          continue;
        }
      }

      //   range filter parsing
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        if (!queryWhere.AND) {
          queryWhere.AND = [];
        }
        if (!queryCountWhere.AND) {
          queryCountWhere.AND = [];
        }

        queryWhere.AND.push({
          [key]: this.parseRangeFilter(value as Record<string, unknown>),
        });
        queryCountWhere.AND.push({
          [key]: this.parseRangeFilter(value as Record<string, unknown>),
        });

        continue;
      }

      if (!queryWhere.AND) {
        queryWhere.AND = [];
      }
      if (!queryCountWhere.AND) {
        queryCountWhere.AND = [];
      }

      queryWhere.AND.push({ [key]: this.parsedValue(value) });
      queryCountWhere.AND.push({ [key]: this.parsedValue(value) });
    }

    return this;
  }

  paginate(): this {
    const page = Number(this.queryParams.page || 1);
    const limit = Number(this.queryParams.limit || 10);

    this.page = page;
    this.limit = limit;

    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  where(condition: TWhereInput): this {
    const queryWhere = this.query.where as IWhereConditions;
    const queryCountWhere = this.countQuery.where as IWhereConditions;

    this.query.where = this.deepMerge(
      queryWhere,
      condition as Record<string, unknown>,
    );
    this.countQuery.where = this.deepMerge(
      queryCountWhere,
      condition as Record<string, unknown>,
    );

    return this;
  }

  include(relation: TInclude): this {
    if (this.query.select) {
      throw new Error("Select and include can not be used together");
    }

    if (!this.query.include) {
      this.query.include = {};
      this.countQuery.include = {};
    }

    this.query.include = { ...this.query.include, ...relation };

    return this;
  }

  omit(fields: Record<string, boolean>): this {
    if (!this.query.omit) {
      this.query.omit = {};
    }
    this.query.omit = { ...this.query.omit, ...fields };
    return this;
  }

  select(
    fields: Record<
      string,
      boolean | Record<string, string | Record<string, boolean>>
    >,
  ): this {
    if (this.query.include) {
      delete this.query.include;
      delete this.countQuery.include;
    }
    if (this.query.omit) {
      delete this.countQuery.omit;
      delete this.query.omit;
    }

    this.query.select = {
      ...this.query.select,
      ...(fields as Record<string, boolean>),
    };

    return this;
  }

  async execute(): Promise<IQueryResult<T>> {
    const [count, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query),
    ]);

    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total: count,
        totalPages: Math.ceil(count / this.limit),
      },
    };
  }

  private deepMerge = (
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> => {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(
          result[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        );
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  private parsedValue = (value: unknown): unknown => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value))) {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parsedValue(item)) };
    }
    return value;
  };

  //   parse range filter
  private parseRangeFilter = (value: Record<string, unknown>) => {
    const rangeFilters: Record<string, unknown> = {};
    const filterNumOpts = ["gt", "gte", "lt", "lte", "equals", "notEquals"];
    for (const operator of Object.keys(value)) {
      const parsedValue =
        typeof value[operator] === "string" && !isNaN(Number(value[operator]))
          ? Number(value[operator])
          : value[operator];

      if (filterNumOpts.includes(operator)) {
        rangeFilters[operator] = parsedValue;
      } else if (["in", "notIn"].includes(operator)) {
        if (Array.isArray(value[operator])) {
          rangeFilters[operator] = value[operator].map((item: any) => {
            return typeof item === "string" && !isNaN(Number(item))
              ? Number(item)
              : item;
          });
        } else {
          rangeFilters[operator] = parsedValue;
        }
      }
    }
    return rangeFilters;
  };
}
