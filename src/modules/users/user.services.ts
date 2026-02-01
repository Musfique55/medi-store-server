import { user_status } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        throw error;
    } 
}

const updateUserStatus = async (id : string,status : user_status) => {
    try {
        const updatedUser = await prisma.user.update({
            where : {
                id 
            },
            data : {
                status
            }
        })
        return updatedUser;

    } catch (error) {
        throw error;
    }
}

export const userServices = {
    getUsers,
    updateUserStatus
}