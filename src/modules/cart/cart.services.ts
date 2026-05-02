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

    return res;
  } catch (error) {
    throw error;
  }
};

export const cartServices = {
  createCart,
  getCart,
};
