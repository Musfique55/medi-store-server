import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";
// import { sendEmail } from "../config/sendEmail";

export const auth = betterAuth({
  appName: "Medical-ecommerce",
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [envVars.APP_URL as string],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignIn: false,
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "CUSTOMER",
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "unban",
      },
    },
  },
  plugins: [
    bearer(),
    // emailOTP({
    //   overrideDefaultEmailVerification: true,
    //   async sendVerificationOTP({ email, otp, type }) {
    //     if (type === "email-verification") {
    //       const user = await prisma.user.findUnique({
    //         where: {
    //           email,
    //           emailVerified: false,
    //         },
    //       });

    //       if (user) {
    //         await sendEmail({
    //           to: user.email,
    //           subject: "Email Verification",
    //           templateName: "otp",
    //           templateData: {
    //             name: user.name,
    //             otp,
    //           },
    //         });
    //       }
    //     }
    //   },
    //   expiresIn: 60 * 10,
    //   otpLength: 4,
    // }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 24 * 60 * 60,
    },
  },
  advanced: {
    useSecureCookies: true,
    cookies: {
      state: {
        attributes: {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      },
      session_token: {
        attributes: {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      },
    },
  },
});
