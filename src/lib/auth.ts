import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins : [process.env.FRONTEND_URL!],
    emailAndPassword : {
        enabled : true,
        requireEmailVerification : false
    },
    user : {
        additionalFields : {
            role : {
                type : "string",
                required : true, 
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