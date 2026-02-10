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

const getManufacturers = async () => {
  try {
    const data = prisma.manufacturer.findMany();
    return data;
  } catch (error) {
    throw error;
  }
}

export const manufacturerService = {
    createManufacturer,
    getManufacturers
}