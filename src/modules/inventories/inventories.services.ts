import { AppError } from "@/helper/AppError";
import { prisma } from "@/lib/prisma";
import { IUpdateInventory } from "./inventories.schema";
import { ActionType } from "@/generated/prisma/enums";

const updateInventory = async (inventoryId: string, data: IUpdateInventory) => {
  try {
    const { quantity, actionType } = data;

    // find existing inventory
    const existingInventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    // check if inventory exists
    if (!existingInventory) {
      throw new AppError("Inventory not found", 404);
    }

    //last history
    const lastHistory = await prisma.history.findFirst({
      where: { inventory_id: inventoryId },
      orderBy: { created_at: "desc" },
    });

    let newQuantity = existingInventory.quantity;

    if (actionType === ActionType.IN) {
      newQuantity += quantity;
    } else if (actionType === ActionType.OUT) {
      if (quantity > existingInventory.quantity) {
        throw new AppError("Cannot deduct from empty inventory", 400);
      }
      newQuantity -= quantity;
    } else {
      throw new AppError("Invalid action type", 400);
    }

    // update inventory
    const updatedInventory = await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          quantity: newQuantity,
          histories: {
            create: {
              action_type: actionType,
              quantity_changed: quantity,
              new_quantity: newQuantity,
              last_quantity: lastHistory?.new_quantity || 0,
            },
          },
        },
        select: {
          catalog_id: true,
          quantity: true,
        },
      });

      await tx.catalog.update({
        where: { id: inventory.catalog_id },
        data: { stock: inventory.quantity },
      });

      return inventory;
    });

    return updatedInventory;
  } catch (error) {
    throw error;
  }
};

const getInventoryById = async (id: string) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: id },
    });

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  } catch (error) {
    throw error;
  }
};

const getInventoryDetails = async (id: string) => {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: id },
      include: {
        histories: {
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            action_type: true,
            quantity_changed: true,
            new_quantity: true,
            last_quantity: true,
            created_at: true,
          },
        },
      },
    });

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  } catch (error) {
    throw error;
  }
};

export const inventoryServices = {
  updateInventory,
  getInventoryById,
  getInventoryDetails,
};
