import {
  DeliveryMethods,
  OrderStatus,
  PaymentStatus,
  Prisma,
} from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "../../types/order";

const newOrder = async (data: CreateOrderInput, cart_id: string) => {
  try {
    console.log(cart_id);
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
        data.order_items.map((item) => {
          try {
            return tx.medicine.update({
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

const getAllOrders = async () => {
  try {
    const data = await prisma.order.findMany({
      include: {
        customer: true,
        order_items: {
          include: {
            product: true,
          },
        },
        reviews: true,
      },
    });

    const formattedStructure = data.map((item) => ({
      ...item,
      order_items: item.order_items.map((o) => o.product),
    }));

    return formattedStructure;
  } catch (error) {
    throw error;
  }
};

const updateOrderStatus = async (
  id: string,
  { status }: { status: OrderStatus },
) => {
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

const getSellersOrder = async (seller_id: string) => {
  try {
    const result = await prisma.order.findMany({
      where: {
        order_items: {
          some: {
            product: {
              seller_id: seller_id,
            },
          },
        },
      },
      include: {
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
            product: true,
          },
        },
      },
      omit: {
        customer_id: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return result;
  } catch (error) {
    throw error;
  }
};

const getUserOrders = async (user_id: string) => {
  try {
    const data = await prisma.order.findMany({
      where: {
        customer_id: user_id,
      },
      include: {
        order_items: {
          select: {
            product: {
              omit: {
                category_id: true,
                purchase_price: true,
              },
            },
          },
        },
      },
      omit: {
        customer_id: true,
      },
    });

    const formattedStructure = data.map((item) => ({
      ...item,
      order_items: item.order_items.map((o) => o.product),
    }));

    return formattedStructure;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDeliveredOrders = async (user_id: string) => {
  try {
    const data = await prisma.order.findMany({
      where: {
        customer_id: user_id,
        order_status: "DELIVERED",
      },
      include: {
        order_items: {
          select: {
            product: {
              omit: {
                category_id: true,
                purchase_price: true,
              },
            },
          },
        },
      },
      omit: {
        customer_id: true,
      },
    });

    const formattedStructure = data.map((item) => ({
      ...item,
      order_items: item.order_items.map((o) => o.product),
    }));

    return formattedStructure;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOrdersByStatus = async (user_id: string, status: OrderStatus) => {
  try {
    const data = await prisma.order.findMany({
      where: {
        customer_id: user_id,
        order_status: status,
      },
      include: {
        order_items: {
          select: {
            product: {
              omit: {
                category_id: true,
                purchase_price: true,
              },
            },
          },
        },
      },
      omit: {
        customer_id: true,
      },
    });

    const formattedStructure = data.map((item) => ({
      ...item,
      order_items: item.order_items.map((o) => o.product),
    }));

    return formattedStructure;
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
  getOrdersByStatus,
  getDeliveredOrders,
};
