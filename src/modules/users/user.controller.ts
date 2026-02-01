import { RequestHandler } from "express";
import { userServices } from "./user.services";

const getUsers : RequestHandler = async (req,res) => {
    try {
        const result = await userServices.getUsers();
        res.status(200).json({
            message : "user created successfully",
            status : true,
            data : result
        })
    } catch (error : any) {
        console.log(error);
        res.status(error.status || 500).json({
            message : error.message || "Server internal Error",
            status : false
        })
    }
}

const updateUsersStatus : RequestHandler = async (req,res) => {
    try {
        const {id,status} = req.body;
        const result = await userServices.updateUserStatus(id,status);
        res.status(201).json({
            message : "user status updated successfully",
            status : true,
            data : result
        })
    } catch (error : any) {
        console.log(error);
        res.status(error.status || 500).json({
            message : error.message || "Server internal Error",
            status : false
        })
    }
}


export const userController = {
    getUsers,
    updateUsersStatus
}