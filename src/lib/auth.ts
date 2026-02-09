import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";



export const auth = betterAuth({
    appName : "Medical-ecommerce",
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins : [process.env.APP_URL as string],
    emailAndPassword : {
        enabled : true,
    },
    user : {
        additionalFields : {
            role : {
                type : "string",
                required : false, 
                defaultValue : "CUSTOMER"
            },
            phone : {
                type : "string"
            },
            status : {
                type : "string",
                defaultValue : "unban"
            }
        }
    }
});