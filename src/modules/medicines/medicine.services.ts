import { Medicine } from "../../generated/prisma/client";
import { MedicineWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createMedicine = async (data: Medicine) => {
  try {
    const medicine = await prisma.$transaction(async (tx) => {
     const medicineData = await tx.medicine.create({
        data,
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
  category_slug?: string,
  minPrice: number = 0,
  maxPrice?: number,
  manufacturer?: string,
) => {
  try {
    const filters: MedicineWhereInput[] = [];

    const baseOmits = {
      seller_id : true,
      category_id : true,
      manufacturer_id : true
    }

    if (category_slug) {
      filters.push({
        OR: [
          {
            category: {
              category_name: {
                contains: category_slug,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }

    if (maxPrice) {
      filters.push({
        retails_price: {
          gte: minPrice,
          lte: maxPrice,
        },
      });
    }

    if (manufacturer) {
      filters.push({
        manufacturer: {
          name: {
            contains: manufacturer,
          },
        },
      });
    }

    const result = await prisma.medicine.findMany({
        where: {
          AND: filters,
        },
        include: {
          category: {
            select : {
              category_name : true
            }
          },
          manufacturer: {
            select : {
              name : true
            }
          },
          seller: isSellerView,
          reviews : {
            select : {
              rating : true,
            }
          }
        },
        omit: isSellerView ? baseOmits : {...baseOmits,purchase_price : true}
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

const getMedicine = async (medicine_id: string) => {
  try {
    const medicine = await prisma.medicine.findUnique({
      where: {
        id: medicine_id,
      },
      include: {
        manufacturer: true,
        reviews : {
            select : {
              id : true,
              image_url : true,
              rating : true,
              description : true
            }
          },
        category : {
          select : {
            id : true,
            category_name : true,
            description : true,
            icon_url : true,
            slug : true
          }
        }  
      },
      omit: {
        manufacturer_id: true,
        category_id : true,
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

export const medicineServices = {
  createMedicine,
  getMedicine,
  getMedicines,
  updateStocks,
  updateMedicine,
  deleteMedicine,
};
