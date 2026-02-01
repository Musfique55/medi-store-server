import { Category } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createCategory = async (data : Category) => {
    try {
        const result = await prisma.category.create({
            data
        })

        return result;
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (id:string,data : Category) => {
    try {
        const {id,author_id,...updatedData} = data;

        const result = await prisma.category.update({
            where : {
                id
            },
            data : updatedData
        })

        return result;
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (id:string) => {
    try {
        const result = await prisma.category.delete({
            where : {
                id
            }
        })

        return result;
    } catch (error) {
        throw error;
    }
}


export const categoryServices = {
    createCategory,
    updateCategory,
    deleteCategory
}