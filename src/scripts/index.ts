import { envVars } from "../config/env";
import { roles } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "new-admin",
      email: envVars.ADMIN_EMAIL as string,
      password: envVars.ADMIN_PASS as string,
    };

    const isExist = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (isExist) {
      //   throw new Error("admin already exist");
      await prisma.user.delete({
        where: {
          email: adminData.email,
        },
      });
    }

    const signAdmin = await fetch(`${envVars.API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    console.log(signAdmin);

    if (signAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
          role: roles.ADMIN,
        },
      });
    }
    console.log(`admin created successfully`);
  } catch (error) {
    console.log(error);
  }
};

seedAdmin();
