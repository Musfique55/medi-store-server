import { prisma } from "./prisma";

export const getMaxPrice = async() => {
     const max_price = await prisma.medicine.aggregate({
      _max : {
        retails_price : true
      }
     }); 
     return max_price._max.retails_price;
}