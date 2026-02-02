import { Manufacturer } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createManufacturer = async (data: Manufacturer) => {
  try {
    const manufacturer = await prisma.manufacturer.create({
        data,
      })

    return manufacturer;
  } catch (error) {
    throw error;
  }
};

export const manufacturerService = {
    createManufacturer
}