import { Medicine } from "../../generated/prisma/client";
import {
  MedicineInclude,
  MedicineWhereInput,
} from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IQueryParams } from "../../types/queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";
import { QueryBuilder } from "../../utils/queryBuilder";

const createMedicine = async (data: Medicine) => {
  const { name } = data;
  const uniqueSlug = generateUniqueSlug(name);
  try {
    const medicine = await prisma.$transaction(async (tx) => {
      const medicineData = await tx.medicine.create({
        data: {
          ...data,
          slug: uniqueSlug,
        },
      });
      await tx.category.update({
        where: {
          id: data.category_id,
        },
        data: {
          product_count: {
            increment: 1,
          },
        },
      });
      await tx.manufacturer.update({
        where: {
          id: data.manufacturer_id,
        },
        data: {
          medicine_count: {
            increment: 1,
          },
        },
      });

      return medicineData;
    });

    return medicine;
  } catch (error) {
    throw error;
  }
};

const getMedicines = async (
  isSellerView: boolean,
  queryParams: IQueryParams,
) => {
  try {
    const baseOmits = {
      seller_id: true,
      category_id: true,
      manufacturer_id: true,
    };

    const queryBuilder = new QueryBuilder<
      Medicine,
      MedicineWhereInput,
      MedicineInclude
    >(prisma.medicine, queryParams, {
      searchableFields: ["name", "description"],
      filterableFields: [
        "stock",
        "is_featured",
        "retails_price",
        "manufacturer.name",
      ],
    });

    const result = await queryBuilder
      .search()
      .filter()
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
        seller: isSellerView,
        reviews: {
          select: {
            rating: true,
          },
        },
      })
      .omit(isSellerView ? baseOmits : { ...baseOmits, purchase_price: true })
      .paginate()
      .execute();

    const d = await prisma.medicine.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: "",
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: "",
                  mode: "insensitive",
                },
              },
            ],
          },
          {
            manufacturer: {
              name: {
                contains: "new",
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const updateStocks = async (id: string, { stock }: { stock: number }) => {
  try {
    const updatedStock = await prisma.medicine.update({
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
    const medicine = await prisma.medicine.findUnique({
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

const updateMedicine = async (medicine_id: string, data: Medicine) => {
  try {
    const { id, seller_id, stock, ...remainingFields } = data;

    const updatedMedicine = await prisma.medicine.update({
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
    const deleted = await prisma.medicine.delete({
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
      by: ["product_id"],
      _count: {
        product_id: true,
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

    const medicineIds = topItems.map((item) => item.product_id);

    const medicines = await prisma.medicine.findMany({
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
      ...medicineMap.get(item.product_id),
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
};
