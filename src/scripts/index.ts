import { roles } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma"

const seedAdmin = async() => {
    try {
        const adminData = {
            name : "new-admin",
            email : "medistoreadmin@gmail.com",
            password : "pass1234",
            role : roles.ADMIN
        }

        const isExist = await prisma.user.findUnique({
          where : {
            email : adminData.email
          }
        })

        if(isExist){
            throw new Error("admin already exist");
        }

        const signAdmin = await fetch(`http://localhost:5000/api/auth/sign-up/email`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Origin" : process.env.APP_URL as string
            },
            body : JSON.stringify(adminData)
        })



        if(signAdmin.ok){
            const updateAdmin = await prisma.user.update({
                where : {
                    email : adminData.email
                },
                data : {
                    emailVerified : true
                }
            })
        }


    } catch (error) {
        console.log(error);
    }
}

seedAdmin();