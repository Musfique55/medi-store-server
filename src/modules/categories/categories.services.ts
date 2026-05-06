import { Category } from "../../generated/prisma/client";
import {
  CategoryInclude,
  CategoryWhereInput,
} from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../types/queryBuilder";
import { QueryBuilder } from "../../utils/queryBuilder";

const createCategory = async (data: Category) => {
  try {
    const result = await prisma.category.create({
      data,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (id: string, data: Category) => {
  try {
    const { id: category_id, author_id, ...updatedData } = data;

    const result = await prisma.category.update({
      where: {
        id: category_id,
      },
      data: updatedData,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id: string) => {
  try {
    const result = await prisma.category.delete({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getCategories = async (queryParams: IQueryParams) => {
  try {
    const queryBuilder = new QueryBuilder<
      Category,
      CategoryWhereInput,
      CategoryInclude
    >(prisma.category, queryParams, {
      searchableFields: ["category_name"],
      filterableFields: ["product_count", "is_active"],
    });
    const result = await queryBuilder.search().filter().paginate().execute();
    return result;
  } catch (error) {
    throw error;
  }
};

export const categoryServices = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
};
