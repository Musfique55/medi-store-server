import { prisma } from "@/lib/prisma";

export const getMaxPrice = async () => {
  const max_price = await prisma.catalog.aggregate({
    _max: {
      retails_price: true,
    },
  });
  return max_price._max.retails_price;
};
