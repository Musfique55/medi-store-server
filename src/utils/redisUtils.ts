import { redisClient } from "../app";
import { IQueryParams } from "../types/queryBuilder";

const buildQueryParamsCacheKey = (
  key: string,
  queryParams: IQueryParams,
  isSellerView?: boolean,
) => {
  const sorted = Object.keys(queryParams)
    .sort()
    .reduce((acc, k) => {
      const val = queryParams[k];

      if (val !== undefined && val !== null) {
        acc[k] = val;
      }
      return acc;
    }, {} as IQueryParams);

  if (isSellerView === undefined) {
    return `${key}:${JSON.stringify(sorted)}`;
  }
  return `${key}:${isSellerView ? "seller" : "customer"}${JSON.stringify(sorted)}`;
};

const getOrSetCache = async (key: string, cb: Promise<any>) => {
  try {
    let result;
    const value = await redisClient.get(key);
    if (value) {
      result = JSON.stringify(value);
    } else {
      result = await cb;
      redisClient.set(key, JSON.stringify(result), { EX: 3600 });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const invalidateCache = async (pattern: string) => {
  for await (const key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    await redisClient.del(key);
  }
};

export { buildQueryParamsCacheKey, invalidateCache, getOrSetCache };
