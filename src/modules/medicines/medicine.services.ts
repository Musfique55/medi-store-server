import { Medicine } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createMedicine = async (data : Medicine) => {
    try {
        const medicine = await prisma.medicine.create({
            data 
        });
        return medicine;
    } catch (error) {
        throw error;
    }
}

export const medicineServices = {
    createMedicine
}