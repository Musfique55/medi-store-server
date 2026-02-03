import { Review } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const giveReview = async (data : Review) => {
    try {
        const review = await prisma.review.create({
            data 
        });

        return review;
    } catch (error) {
        throw error;
    }
}

const deleteReview = async (id : string) => {
    try {
        const data = await prisma.review.delete({
            where : {
                id
            }
        });
        return data;
    } catch (error) {
        throw error;
    }
}


export const reviewServices = {
    giveReview,
    deleteReview
}