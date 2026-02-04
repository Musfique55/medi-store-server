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
        const {id : category_id,author_id,...updatedData} = data;

        const result = await prisma.category.update({
            where : {
                 id : category_id
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

const getCategories = async () => {
    try {
        const result = await prisma.category.findMany({
            omit : {
                author_id : true
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}


export const categoryServices = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
}