import { AppError } from "../helper/AppError";
import { prisma } from "../lib/prisma";
import { generateUniqueSlug } from "../utils/generateUniqueSlug";

const updateSlug = async () => {
  try {
    const data = await prisma.medicine.findMany({
      where: {
        slug: null,
      },
    });

    if (data.length === 0) {
      throw new AppError("nothing to update", 400);
    }

    data.forEach(async (medicine) => {
      const slug = generateUniqueSlug(medicine.name);
      await Promise.all([
        prisma.medicine.update({
          where: {
            id: medicine.id,
          },
          data: {
            slug,
          },
        }),
      ]);
    });
  } catch (error) {
    console.log("error occured during updating slug", error);
  }
};

updateSlug();
