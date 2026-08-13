import { IQueryParams } from "../../types/queryBuilder";
import { QueryBuilder } from "../../utils/queryBuilder";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { Catalog } from "./medicine.schema";
import { v4 as uuid } from "uuid";
import {
  CatalogInclude,
  CatalogWhereInput,
} from "../../generated/prisma/models";

const createMedicine = async (data: Catalog) => {
  const { name } = data;
  const uniqueSlug = name.split(" ").join("-") + "-" + uuid().slice(0, 8);
  const productId = uuid();
  const inventoryId = uuid();
  try {
    const [product] = await prisma.$transaction([
      // product data
      prisma.catalog.create({
        data: {
          ...data,
          slug: uniqueSlug,
          id: productId,
          inventory_id: inventoryId,
        },
      }),

      // inventory data
      prisma.inventory.create({
        data: {
          id: inventoryId,
          catalog_id: productId,
          quantity: 0,
          seller_id: data.seller_id,
        },
      }),
    ]);

    return product;
  } catch (error) {
    throw error;
  }
};

const getMedicines = async (queryParams: IQueryParams) => {
  try {
    const conditions: Prisma.Sql[] = [];

    if (queryParams?.searchTerm) {
      const searchPattern = `%${queryParams.searchTerm}%`;
      conditions.push(
        Prisma.sql`("medicine".name ILIKE ${searchPattern} OR "medicine".description ILIKE ${searchPattern})`,
      );
    }

    if (queryParams?.isFeatured) {
      const val = JSON.parse(queryParams.isFeatured as string);
      conditions.push(Prisma.sql`("medicine".is_featured = ${val})`);
    }

    if (queryParams?.category || queryParams?.category_id) {
      const pattern = `%${queryParams.category}%`;
      const id = queryParams.category_id;
      conditions.push(
        Prisma.sql`("cat".category_name ILIKE ${pattern} OR "cat".slug ILIKE ${pattern} OR "cat".id = ${id})`,
      );
    }

    if (queryParams?.manufacturer || queryParams?.manufacturer_id) {
      const pattern = `%${queryParams.manufacturer}%`;
      const id = queryParams.manufacturer_id;
      conditions.push(
        Prisma.sql`("manu".name ILIKE ${pattern} OR "manu".description ILIKE ${pattern} OR "manu".id = ${id})`,
      );
    }

    if (
      queryParams?.retails_price &&
      typeof queryParams.retails_price === "object"
    ) {
      if (queryParams.retails_price.gte !== undefined) {
        const gteVal = Number(queryParams.retails_price.gte);
        if (!isNaN(gteVal)) {
          conditions.push(Prisma.sql`("medicine".retails_price >= ${gteVal})`);
        }
      }
      if (queryParams.retails_price.lte !== undefined) {
        const lteVal = Number(queryParams.retails_price.lte);
        if (!isNaN(lteVal)) {
          conditions.push(Prisma.sql`("medicine".retails_price <= ${lteVal})`);
        }
      }
    }

    if (queryParams?.stock) {
      conditions.push(Prisma.sql`("medicine".stock >= ${queryParams.stock})`);
    }

    const whereClause =
      conditions.length > 0
        ? Prisma.join(conditions, " AND ")
        : Prisma.sql`1=1`;

    const [data, count] = await Promise.all([
      prisma.$queryRaw<Catalog[]>`
      WITH ranked_products AS (
        SELECT 
        "medicine".*,
        "cat".category_name as category_name,
        "manu".name as manufacturer_name,
        (ROW_NUMBER() OVER(
          PARTITION BY seller_id
          ORDER BY "medicine".created_at DESC
        ))::INT as seller_ranks
        FROM "medicine"
        LEFT JOIN "category" AS "cat" ON "cat"."id" = "medicine"."category_id"
        LEFT JOIN "manufacturer" AS "manu" ON "manu"."id" = "medicine"."manufacturer_id"
        WHERE ${whereClause}
      )
      SELECT 
      id,
      name,
      description,
      retails_price,
      image_url,
      stock,
      discount_type,
      discount_value,
      purchase_price,
      slug,
      is_featured,
      reserved_stock,
      is_active,
      category_name,
      manufacturer_name,
      seller_ranks,
      seller_id,
      created_at,
      updated_at
      FROM ranked_products
      ORDER BY seller_ranks ASC, created_at DESC
      LIMIT ${Number(queryParams.limit) || 10} 
      OFFSET ${(Number(queryParams.page || 1) - 1) * (Number(queryParams.limit) || 10)}
    `,
      prisma.$queryRaw<
        { total: number }[]
      >`SELECT COUNT(*)::INT as total FROM "medicine"
        LEFT JOIN "category" AS "cat" ON "cat"."id" = "medicine"."category_id"
        LEFT JOIN "manufacturer" AS "manu" ON "manu"."id" = "medicine"."manufacturer_id"
       WHERE ${whereClause}`,
    ]);

    return {
      data,
      meta: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        total: count[0]?.total || 0,
        totalPages: Math.ceil(
          (count[0]?.total || 1) / (Number(queryParams.limit) || 10),
        ),
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getSellersMedicine = async (
  queryParams: IQueryParams,
  userId: string,
) => {
  try {
    const queryBuilder = new QueryBuilder<
      Catalog,
      CatalogWhereInput,
      CatalogInclude
    >(prisma.catalog, queryParams, {
      searchableFields: ["name", "description"],
      filterableFields: [
        "stock",
        "is_featured",
        "retails_price",
        "manufacturer.name",
      ],
    });

    const result = await queryBuilder
      .where({
        seller_id: userId,
      })
      .include({
        category: {
          select: {
            category_name: true,
            slug: true,
          },
        },
        manufacturer: {
          select: {
            name: true,
          },
        },
        seller: false,
      })
      .search()
      // .filter()
      .paginate()
      .omit({ seller_id: true, category_id: true, manufacturer_id: true })
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const updateStocks = async (id: string, { stock }: { stock: number }) => {
  try {
    const updatedStock = await prisma.catalog.update({
      where: {
        id,
      },
      data: {
        stock,
      },
    });

    return updatedStock;
  } catch (error) {
    throw error;
  }
};

const getMedicine = async (slug: string) => {
  try {
    const medicine = await prisma.catalog.findUnique({
      where: {
        slug,
      },
      include: {
        manufacturer: true,
        reviews: {
          select: {
            id: true,
            author: true,
            image_url: true,
            rating: true,
            description: true,
            created_at: true,
          },
        },
        category: {
          select: {
            id: true,
            category_name: true,
            description: true,
            icon_url: true,
            slug: true,
          },
        },
      },
      omit: {
        manufacturer_id: true,
        category_id: true,
      },
    });

    return medicine;
  } catch (error) {
    throw error;
  }
};

const updateMedicine = async (medicine_id: string, data: any) => {
  try {
    const { id, seller_id, stock, ...remainingFields } = data;

    const updatedMedicine = await prisma.catalog.update({
      where: {
        id: medicine_id,
      },
      data: remainingFields,
    });

    return updatedMedicine;
  } catch (error) {
    throw error;
  }
};

const deleteMedicine = async (id: string) => {
  try {
    const deleted = await prisma.catalog.delete({
      where: {
        id,
      },
    });
    return deleted;
  } catch (error) {
    throw error;
  }
};

const topMedicines = async () => {
  try {
    const topItems = await prisma.orderItems.groupBy({
      by: ["catalog_id"],
      _count: {
        catalog_id: true,
        order_id: true,
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 10,
    });

    const medicineIds = topItems.map((item) => item.catalog_id);

    const medicines = await prisma.catalog.findMany({
      where: {
        id: {
          in: medicineIds,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        retails_price: true,
        image_url: true,
        stock: true,
      },
    });

    const medicineMap = new Map(medicines.map((item) => [item.id, item]));

    const result = topItems.map((item) => ({
      ...medicineMap.get(item.catalog_id),
      totalSold: item._sum.quantity,
      totalOrders: item._count.order_id,
    }));

    return result;
  } catch (error) {
    throw error;
  }
};

export const medicineServices = {
  createMedicine,
  getMedicine,
  getMedicines,
  updateStocks,
  updateMedicine,
  deleteMedicine,
  topMedicines,
  getSellersMedicine,
};
