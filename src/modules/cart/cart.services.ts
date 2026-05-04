import { prisma } from "../../lib/prisma";

const createCart = async (cartId: string, product: any, quantity: number) => {
  try {
    // First, ensure the cart exists
    let cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      // Create cart if it doesn't exist
      cart = await prisma.cart.create({
        data: {
          id: cartId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
    }

    // Check if the product already exists in the cart
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cartId,
        productId: product.productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return await prisma.cartItems.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      // Create new cart item
      return await prisma.cartItems.create({
        data: {
          cartId,
          productId: product.productId,
          name: product.name,
          price: product.retails_price || product.price,
          quantity,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCart = async (cartId: string) => {
  try {
    const res = await prisma.cart.findFirst({
      where: {
        id: cartId,
      },
      include: {
        items: true,
      },
    });

    if (!res) {
      return [];
    }

    return res;
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (productId: string, cartId: string) => {
  try {
    const existingItem = await prisma.cart.findFirst({
      where: {
        id: cartId,
      },
      include: {
        items: true,
      },
    });

    if (!existingItem) {
      throw new Error("item not found");
    }

    if (existingItem.items.length === 1) {
      return await prisma.cart.delete({
        where: {
          id: cartId,
        },
      });
    }

    const res = await prisma.cartItems.delete({
      where: {
        productId_cartId: {
          productId,
          cartId,
        },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateQuantityFromCart = async (
  productId: string,
  cartId: string,
  quantity: number,
) => {
  try {
    const res = await prisma.cartItems.update({
      where: {
        productId_cartId: {
          productId,
          cartId,
        },
      },
      data: {
        quantity: {
          set: quantity,
        },
      },
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const mergeCart = async (cartId: string, userId: string) => {
  try {
    const guestCart = await prisma.cart.findFirst({
      where: {
        id: cartId,
      },
      include: {
        items: true,
      },
    });

    if (!guestCart) {
      return null;
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        id: userId,
      },
      include: {
        items: true,
      },
    });

    if (!userCart) {
      return await prisma.cart.update({
        where: {
          id: cartId,
        },
        data: {
          id: userId,
        },
      });
    }

    //now merge the guest cart with user cart
    return prisma.$transaction(async (tx) => {
      for (const item of guestCart.items) {
        const existingItem = userCart.items.find(
          (i) => i.productId === item.productId,
        );

        if (existingItem) {
          await tx.cartItems.update({
            where: {
              id: existingItem.id,
            },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        } else {
          await tx.cartItems.create({
            data: {
              cartId: userId,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            },
          });
        }
      }

      //delete guest cart
      await tx.cart.delete({
        where: {
          id: cartId,
        },
      });

      return tx.cart.findUnique({
        where: {
          id: userId,
        },
        include: {
          items: true,
        },
      });
    });
  } catch (error) {
    throw error;
  }
};

export const cartServices = {
  createCart,
  getCart,
  removeProductFromCart,
  updateQuantityFromCart,
  mergeCart,
};
