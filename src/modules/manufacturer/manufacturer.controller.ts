import { RequestHandler } from "express";
import { manufacturerService } from "./manufacturer.services";

const createManufacturer : RequestHandler = async (req,res) => {
    try {
        const result = await manufacturerService.createManufacturer(req.body);
        res.status(201).json({
            message : "Manufacturer created successfully",
            success : true,
            data : result
        });
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message,
            success : false
        })
    }
}

export const manufacturerController = {
    createManufacturer
}