import { discountType, Prisma } from "../generated/prisma/client";
import { CreateOrderInput } from "../types/order";
import { prisma } from "./prisma";

const calculateDiscountedPrice = (
  type: discountType,
  discountValue: number,
  amount: number,
) => {
  if (type === "PERCENTAGE") {
    return Number(amount) - (Number(amount) * Number(discountValue)) / 100;
  } else {
    return Number(amount) - Number(discountValue);
  }
};

export const validateCart = async (items: CreateOrderInput) => {
  const productIds = items.order_items.map((item) => item.product_id);
  const products = await prisma.medicine.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      retails_price: true,
      stock: true,
      name: true,
      discount_type: true,
      discount_value: true,
    },
  });

  const errors = [];

  for (const item of items.order_items) {
    const dbProduct = products.find((p) => p.id === item.product_id);
    if (!dbProduct) {
      errors.push(`Product ${item.product_id} not found.`);
      continue;
    }

    const discountedPrice = calculateDiscountedPrice(
      dbProduct.discount_type,
      dbProduct.discount_value!,
      Number(dbProduct.retails_price),
    );

    const discountedUnitPrice = calculateDiscountedPrice(
      dbProduct.discount_type,
      dbProduct.discount_value!,
      Number(item.unit_price),
    );

    if (dbProduct.stock < item.quantity) {
      errors.push(
        `${dbProduct.name} is out of stock (Requested: ${item.quantity}, Available: ${dbProduct.stock}).`,
      );
    }

    if (dbProduct.discount_type === discountType.PERCENTAGE) {
      if (discountedPrice !== discountedUnitPrice) {
        errors.push(
          `Price for ${dbProduct.name} has changed. Please refresh your cart.`,
        );
      }
    } else if (dbProduct.discount_type === discountType.FIXED) {
      if (discountedPrice !== discountedUnitPrice) {
        errors.push(
          `Price for ${dbProduct.name} has changed. Please refresh your cart.`,
        );
      }
    } else {
      if (
        !dbProduct.retails_price.equals(new Prisma.Decimal(item.unit_price))
      ) {
        errors.push(
          `Price for ${dbProduct.name} has changed. Please refresh your cart.`,
        );
      }
    }
  }

  return errors;
};
