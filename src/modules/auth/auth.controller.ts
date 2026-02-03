import { RequestHandler } from "express";
import { auth } from "../../lib/auth";
import { authServices } from "./auth.services";

const getLoggedInUser : RequestHandler = async (req,res) => {
    try {
        const session = await auth.api.getSession({headers : req.headers as any});
        const user = await authServices.getLoggedInUser(session?.user.id!);
        res.status(200).json({
            message : "user fetched successfully",
            success : true,
            data : user
        })
    } catch (error) {
        
    }
}

export const authController = {
    getLoggedInUser
}