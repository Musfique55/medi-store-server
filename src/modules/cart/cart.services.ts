import { AppError } from "../../helper/AppError";
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
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
    }

    const medProduct = await prisma.medicine.findUnique({
      where: {
        id: product?.product_id,
      },
    });

    if (!medProduct) {
      throw new AppError("product not found", 404);
    }

    if (medProduct.stock < quantity) {
      throw new AppError("stock not available", 400);
    }

    // Check if the product already exists in the cart
    const existingItem = await prisma.cartItems.findFirst({
      where: {
        cart_id: cart.id,
        product_id: product.product_id,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      return await prisma.$transaction(async (tx) => {
        const updateItem = await tx.cartItems.update({
          where: { id: existingItem.id },
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
        await tx.medicine.update({
          where: {
            id: product.product_id,
          },
          data: {
            reserved_stock: {
              increment: quantity,
            },
            stock: {
              decrement: quantity,
            },
          },
        });

        return updateItem;
      });
    } else {
      // Create new cart item
      return await prisma.$transaction(async (tx) => {
        const newCartItem = await tx.cartItems.create({
          data: {
            cart_id: cart.id,
            product_id: product.product_id,
            name: product.name,
            price: product.retails_price || product.price,
            quantity,
          },
        });

        await tx.medicine.update({
          where: {
            id: product.product_id,
          },
          data: {
            reserved_stock: {
              set: quantity,
            },
            stock: {
              decrement: quantity,
            },
          },
        });

        return newCartItem;
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
        items: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    if (!res) {
      return { items: [] };
    }

    return res;
  } catch (error) {
    throw error;
  }
};

const removeProductFromCart = async (productId: string, cartId: string) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        id: cartId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      throw new AppError("item not found", 404);
    }

    if (cart.items.length === 1) {
      return await prisma.$transaction(async (tx) => {
        await tx.medicine.update({
          where: {
            id: productId,
          },
          data: {
            reserved_stock: {
              set: 0,
            },
            stock: {
              increment: cart.items[0]!.quantity,
            },
          },
        });
        return await tx.cart.delete({
          where: {
            id: cartId,
          },
        });
      });
    }

    const cartItem = await prisma.cartItems.findFirst({
      where: {
        product_id: productId,
        cart_id: cartId,
      },
    });

    if (!cartItem) {
      throw new AppError("item not found", 404);
    }

    const res = await prisma.$transaction(async (tx) => {
      await tx.medicine.update({
        where: {
          id: productId,
        },
        data: {
          reserved_stock: {
            decrement: cartItem.quantity,
          },
          stock: {
            increment: cartItem.quantity,
          },
        },
      });
      const deletedItem = await tx.cartItems.delete({
        where: {
          product_id_cart_id: {
            product_id: productId,
            cart_id: cartId,
          },
        },
      });

      return deletedItem;
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateQuantityFromCart = async (
  operation: "increment" | "decrement",
  productId: string,
  cartId: string,
  quantity: number,
) => {
  try {
    let res;
    if (quantity > 0) {
      const product = await prisma.medicine.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new AppError("product not found", 404);
      }

      const cartItem = await prisma.cartItems.findFirst({
        where: {
          product_id: productId,
          cart_id: cartId,
        },
      });

      if (!cartItem) {
        throw new AppError("item not found", 404);
      }

      res = await prisma.$transaction(async (tx) => {
        let updatedCartItem;

        if (operation === "increment") {
          if (product.stock < quantity) {
            throw new AppError("stock not available", 400);
          }
          updatedCartItem = await tx.cartItems.update({
            where: {
              product_id_cart_id: {
                product_id: productId,
                cart_id: cartId,
              },
            },
            data: {
              quantity: {
                set: quantity,
              },
            },
          });

          await tx.medicine.update({
            where: {
              id: productId,
            },
            data: {
              reserved_stock: {
                set: quantity,
              },
              stock: {
                decrement: quantity,
              },
            },
          });
        } else if (operation === "decrement") {
          if (quantity < 0) {
            throw new AppError("invalid quantity", 400);
          }
          updatedCartItem = await tx.cartItems.update({
            where: {
              product_id_cart_id: {
                product_id: productId,
                cart_id: cartId,
              },
            },
            data: {
              quantity: {
                set: quantity,
              },
            },
          });
          await tx.medicine.update({
            where: {
              id: productId,
            },
            data: {
              reserved_stock: {
                decrement: cartItem.quantity - quantity,
              },
              stock: {
                increment: cartItem.quantity - quantity,
              },
            },
          });
        }

        return updatedCartItem;
      });
    } else {
      res = await removeProductFromCart(productId, cartId);
    }
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
          (i) => i.product_id === item.product_id,
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
              cart_id: userId,
              product_id: item.product_id,
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

const clearExpiredCart = async () => {
  try {
    const expiredCarts = await prisma.cart.findMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
      include: {
        items: true,
      },
    });

    await prisma.$transaction(async (tx) => {
      for (const cart of expiredCarts) {
        await tx.cart.delete({
          where: {
            id: cart.id,
          },
        });

        for (const item of cart.items) {
          await tx.medicine.update({
            where: {
              id: item.product_id,
            },
            data: {
              reserved_stock: {
                decrement: item.quantity,
              },
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    });

    return { message: "Expired carts cleared successfully" };
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
  clearExpiredCart,
};
