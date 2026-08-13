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
          tax: data.tax,
          order_items: {
            create: data.order_items.map((item) => ({
              catalog_id: item.catalog_id,
              catalog_name: item.catalog_name,
              quantity: item.quantity,
              unit_price: new Prisma.Decimal(item.unit_price),
              total: new Prisma.Decimal(item.unit_price * item.quantity),
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
            return await tx.catalog.update({
              where: {
                id: item.catalog_id,
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
            throw new Error(`FAILED_PRODUCT_${item.catalog_id}`);
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
    const data = await queryBuilder.search().filter().paginate().execute();

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
    // const queryBuilder = new QueryBuilder<Order, OrderWhereInput, OrderInclude>(
    //   prisma.order,
    //   query,
    //   {
    //     searchableFields: ["customer_id", "order_items.product.name"],
    //     filterableFields: ["order_status", "delivery_method", "payment_status"],
    //   },
    // );
    // const result = await queryBuilder
    //   .where({
    //     order_items: {
    //       some: {
    //         catalog: {
    //           seller_id: seller_id,
    //         },
    //       },
    //     },
    //   })
    //   .omit({
    //     customer_id: true,
    //   })
    //   .search()
    //   .filter()
    //   .paginate()
    //   .execute();
    const result = {};
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
