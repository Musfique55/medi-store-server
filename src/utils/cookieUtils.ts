import { Request, Response } from "express"

const getCookie = (req : Request,key : string) => {
    const parsedValue = req.cookies?.[key];
    if (parsedValue) {
        return parsedValue;
    }

    const rawCookie = req.headers?.cookie;
    if (!rawCookie) {
        return undefined;
    }

    const cookies = rawCookie.split(";").map((cookie) => cookie.trim());
    const values = cookies
        .map((cookie) => {
            const [cookieKey, ...cookieVal] = cookie.split("=");
            if (cookieKey === key) {
                return decodeURIComponent(cookieVal.join("="));
            }
            return undefined;
        })
        .filter((value): value is string => typeof value === "string");

    return values.length ? values[values.length - 1] : undefined;
}

const isSecureCookie = process.env.NODE_ENV === "production";

const setCookie = (res : Response,key : string,value : string,{maxAge} : {maxAge : number}) => {
    res.cookie(key,value,{ 
        sameSite : isSecureCookie ? 'none' : 'lax',
        secure : isSecureCookie,
        httpOnly : true,
        maxAge,
        path : '/'
    })
}

const clearCookie = (res : Response,key : string) => {
    res.clearCookie(key,{
        sameSite : isSecureCookie ? 'none' : 'lax',
        secure : isSecureCookie,
        httpOnly : true,
        path : '/'
    })
}

export const cookieUtils = {
    getCookie,
    setCookie,
    clearCookie
}