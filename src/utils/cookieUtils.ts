import { Request, Response } from "express"

const getCookie = (req : Request,key : string) => {
    return req.cookies[key];
}

const setCookie = (res : Response,key : string,value : string,{maxAge} : {maxAge : number}) => {
    res.cookie(key,value,{
        sameSite : 'none',
        secure : true,
        httpOnly : true,
        maxAge,
        path : '/'
    })
}

const clearCookie = (res : Response,key : string) => {
    res.clearCookie(key,{
        sameSite : 'none',
        secure : true,
        httpOnly : true,
        path : '/'
    })
}

export const cookieUtils = {
    getCookie,
    setCookie,
    clearCookie
}