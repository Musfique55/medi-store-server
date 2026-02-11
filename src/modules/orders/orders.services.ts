
import { DeliveryMethods, OrderStatus, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateOrderInput } from "../../types/order";

const newOrder = async (data: CreateOrderInput) => {
  try {
   const date = new Date().toISOString().replace(/[-:.TZ]/g,"");

   const generateOrderNumber = `order-${date}`;

    const ordered = await prisma.$transaction(async (tx) => {
      const ordered_items = await tx.order.create({
        data: {
          customer_id: data.customer_id,
          order_number : generateOrderNumber,
          subtotal : new Prisma.Decimal(data.total_amount),
          total_amount: new Prisma.Decimal(data.total_amount),
          shipping_address: data.shipping_address,
          delivery_method:  DeliveryMethods.COD,
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
        ordered_items.order_items.map((item) => {
          const update = tx.medicine.update({
            where: {
              id: item.product_id,
              stock: {
                gte: item.quantity,
              },
              retails_price: {
                equals: item.unit_price,
              },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
          if (!update) throw new Error(`FAILED_PRODUCT_${item.product_id}`);
        }),
      );

      return ordered_items;
    });
    console.log(ordered);

    return ordered;
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
      order_items : item.order_items.map(o => o.product)
    }))
    
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
      order_items : item.order_items.map(o => o.product)
    }))
    
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
        order_status : "DELIVERED"
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
      order_items : item.order_items.map(o => o.product)
    }))
    
    return formattedStructure;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActiveShippedOrders = async (user_id: string) => {
  try {
    const data = await prisma.order.findMany({
      where: {
        customer_id: user_id,
        order_status : "SHIPPED"
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
      order_items : item.order_items.map(o => o.product)
    }))
    
    return formattedStructure;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const getOrderDetails = async (order_id: string) => {
  try {
    const orderDetails = await prisma.order.findUnique({
      where: {
        id: order_id,
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
  getActiveShippedOrders,
  getDeliveredOrders
};
