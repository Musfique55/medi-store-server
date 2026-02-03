import { prisma } from "../../lib/prisma";

const getLoggedInUser = async (user_id : string) => {
    try {
        const user = await prisma.user.findUnique({
            where : {
                id : user_id
            }
        })
        return user;
    } catch (error) {
        throw error;
    }
}


export const authServices = {
    getLoggedInUser
}