import {
  DeliveryMethods,
  Order,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "../../generated/prisma/client";
import { OrderInclude, OrderWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "../../types/order";
import { IQueryParams } from "../../types/queryBuilder";
import { QueryBuilder } from "../../utils/queryBuilder";

const newOrder = async (data: CreateOrderInput, cart_id: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customer_id: data.customer_id,
          order_number: data.order_number,
          subtotal: data.subtotal,
          total_amount: data.total_amount,
          shipping_address: data.shipping_address,
          payment_status: data.payment_status as PaymentStatus,
          delivery_method: data.delivery_method as DeliveryMethods,
          order_items: {
            create: data.order_items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: new Prisma.Decimal(item.unit_price),
            })),
          },
        },
        include: {
          order_items: true,
        },
      });

      await Promise.all(
        data.order_items.map(async (item) => {
          try {
            return await tx.medicine.update({
              where: {
                id: item.product_id,
                stock: {
                  gte: item.quantity,
                },
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          } catch (error) {
            throw new Error(`FAILED_PRODUCT_${item.product_id}`);
          }
        }),
      );

      // delete the cart items
      await tx.cart.delete({
        where: {
          id: cart_id,
        },
      });

      return order;
    });
  } catch (error: any) {
    throw error;
  }
};

const getAllOrders = async (query: IQueryParams) => {
  try {
    const queryBuilder = new QueryBuilder<Order, OrderWhereInput, OrderInclude>(
      prisma.order,
      query,
      {
        searchableFields: ["customer_id", "order_items.product.name"],
        filterableFields: ["order_status", "delivery_method", "payment_status"],
      },
    );
    const data = await queryBuilder
      .include({
        customer: true,
      })
      .omit({
        customer_id: true,
      })
      .search()
      .filter()
      .paginate()
      .execute();

    return data;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
  try {
    const data = await prisma.order.update({
      where: {
        id,
      },
      data: {
        order_status: status,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getSellersOrder = async (seller_id: string, query: IQueryParams) => {
  try {
    const queryBuilder = new QueryBuilder<Order, OrderWhereInput, OrderInclude>(
      prisma.order,
      query,
      {
        searchableFields: ["customer_id", "order_items.product.name"],
        filterableFields: ["order_status", "delivery_method", "payment_status"],
      },
    );
    const result = await queryBuilder
      .where({
        order_items: {
          some: {
            product: {
              seller_id: seller_id,
            },
          },
        },
      })
      .include({
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        order_items: {
          where: {
            product: {
              seller_id: seller_id,
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                retails_price: true,
                purchase_price: true,
                discount_type: true,
                discount_value: true,
              },
            },
          },
        },
      })
      .omit({
        customer_id: true,
      })
      .search()
      .filter()
      .paginate()
      .execute();

    return result;
  } catch (error) {
    throw error;
  }
};

const getUserOrders = async (user_id: string, query: IQueryParams) => {
  try {
    const queryBuilder = new QueryBuilder<Order, OrderWhereInput, OrderInclude>(
      prisma.order,
      query,
      {
        searchableFields: ["customer_id", "order_items.product.name"],
        filterableFields: ["order_status", "delivery_method", "payment_status"],
      },
    );
    const data = await queryBuilder
      .where({ customer_id: user_id, order_status: { not: "CANCELLED" } })
      .include({
        order_items: {
          select: {
            unit_price: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                discount_type: true,
                discount_value: true,
              },
            },
          },
        },
      })
      .omit({
        customer_id: true,
      })
      .search()
      .filter()
      .paginate()
      .execute();

    const formattedStructure = data.data.map((item: any) => ({
      ...item,
      order_items: item.order_items.map((oi: any) => {
        const { product, ...rest } = oi;

        return {
          ...rest,
          ...product,
        };
      }),
    }));

    return {
      ...data,
      data: formattedStructure,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOrderDetails = async (order_id: string, user_id: string) => {
  try {
    const orderDetails = await prisma.order.findFirst({
      where: {
        id: order_id,
        customer_id: user_id,
      },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                retails_price: true,
              },
            },
          },
          omit: {
            order_id: true,
            unit_price: true,
          },
        },
      },
      omit: {
        customer_id: true,
      },
    });

    return orderDetails;
  } catch (error) {
    throw error;
  }
};

export const orderServices = {
  newOrder,
  updateOrderStatus,
  getSellersOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
};
