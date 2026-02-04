import { RequestHandler } from "express";
import { categoryServices } from "./categories.services";


const createCategory : RequestHandler = async (req,res) => {
    try {
        const result = await categoryServices.createCategory(req.body);
        res.status(201).json({
            message : "Category created successfully",
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

const updateCategory : RequestHandler = async (req,res) => {
    try {
        const {id} = req.params;
        const result = await categoryServices.updateCategory(id as string,req.body);
        res.status(201).json({
            message : "Category updated successfully",
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

const deleteCategory : RequestHandler = async (req,res) => {
    try {
        const {id} = req.params;
         await categoryServices.deleteCategory(id as string);
        res.status(201).json({
            message : "Category deleted successfully",
            success : true
        });
    } catch (error : any) {
        res.status(error.status || 500).json({
            message : error.message,
            success : false
        })
    }
}

const getCategories : RequestHandler = async (req,res) => {
    try {
       
        const result = await categoryServices.getCategories();
        res.status(200).json({
            message : "Categories fetched successfully",
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


export const categoryController = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories
}