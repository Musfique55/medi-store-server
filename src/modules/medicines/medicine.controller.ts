import { RequestHandler } from "express";
import { medicineServices } from "./medicine.services";


const createMedicine : RequestHandler = async (req,res) => {
    try {
        const result = await medicineServices.createMedicine(req.body);
        res.status(201).json({
            message : "medicine created successfully",
            success : true,
            data : result
        })
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message,
            success : false
        })
    }
}


export const medicineController = {
    createMedicine
}