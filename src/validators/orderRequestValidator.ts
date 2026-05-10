import { NextFunction, Request, Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma";
import { discountType } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import { OrderItemInput } from "../types/order";
import { nanoid } from "nanoid";
import { AppError } from "../helper/AppError";

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

export const orderRequestValidator =
  (schema: z.ZodSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          success: false,
          error: result.error,
        });
      }

      const id = nanoid(10);

      const generateOrderNumber = `order-${id}`;

      const cart = result.data.order_items as OrderItemInput[];
      result.data.customer_id = req.user?.id;
      result.data.order_number = generateOrderNumber;

      const dbProducts = await prisma.medicine.findMany({
        where: {
          id: {
            in: cart.map((item) => item.product_id),
          },
        },
        select: {
          seller_id: true,
          stock: true,
          retails_price: true,
          discount_type: true,
          discount_value: true,
          id: true,
          name: true,
        },
      });

      if (dbProducts.length !== cart.length) {
        return res.status(400).json({
          message: "Validation failed",
          success: false,
          error: "Some products are invalid",
        });
      }

      for (const product of dbProducts) {
        const cartItem = cart.find((item) => item.product_id === product.id);

        if (!cartItem) {
          continue;
        }

        if (cartItem.quantity > product.stock) {
          return res.status(400).json({
            message: "Validation failed",
            success: false,
            error: `Product ${product.name} has insufficient stock`,
          });
        }

        if (!product.seller_id) {
          return res.status(400).json({
            message: "Validation failed",
            success: false,
            error: `Product ${product.name} is not sold by any seller`,
          });
        }

        if (product.discount_type !== discountType.NONE) {
          if (product.discount_type === discountType.PERCENTAGE) {
            cartItem.unit_price = calculateDiscountedPrice(
              product.discount_type,
              product.discount_value!,
              Number(product.retails_price),
            );
          } else {
            cartItem.unit_price = calculateDiscountedPrice(
              product.discount_type,
              product.discount_value!,
              Number(product.retails_price),
            );
          }
        } else {
          cartItem.unit_price = Number(product.retails_price);
        }
      }

      const subtotal = cart.reduce(
        (total: Prisma.Decimal, item) =>
          total.add(new Prisma.Decimal(item.unit_price).mul(item.quantity)),
        new Prisma.Decimal("0.00"),
      );

      const total = subtotal;

      result.data.subtotal = subtotal;
      result.data.total_amount = total;

      req.body = result.data;
      next();
    } catch (error: any) {
      throw new AppError(
        error.message || "Internal Server Error",
        error.statusCode || 500,
      );
    }
  };
