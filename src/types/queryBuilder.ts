export interface IPrismaModelDelegate {
  findMany(args: any): Promise<any[]>;
  count(args: any): Promise<number>;
}

export interface IQueryConfig {
  searchableFields: string[];
  filterableFields: string[];
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IQueryParams {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  fields?: string;
  includes?: string;
  [key: string]: unknown;
}

export interface IWhereConditions {
  OR?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface PrismaFindManyArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: Record<string, unknown>;
  omit?: Record<string, boolean | Record<string, unknown>>;
  [key: string]: unknown;
}

export interface PrismaCountQueryArgs {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
  cursor?: Record<string, unknown>;
  distinct?: Record<string, unknown>;
  omit?: Record<string, boolean | Record<string, unknown>>;
  [key: string]: unknown;
}
