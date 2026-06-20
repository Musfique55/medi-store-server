import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../helper/AppError";
import { jwtUtils } from "../../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";
import { roles } from "../../generated/prisma/enums";

const getLoggedInUser = async (user_id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    console.log(session);

    if (!session) {
      throw new AppError("Invalid credentials", 400);
    }

    const tokenPayload = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      status: session.user.status,
      emailVerified: session.user.emailVerified,
    };

    const accessToken = jwtUtils.createToken(tokenPayload);
    const refreshToken = jwtUtils.createToken(tokenPayload);

    return {
      ...session,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    // console.log(error);
    throw new AppError(error.message, error.statusCode);
  }
};

const register = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: roles;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    throw new AppError("User already exists", 400);
  }

  const session = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
  });

  const tokenPayload = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  };

  const accessToken = jwtUtils.createToken(tokenPayload);
  const refreshToken = jwtUtils.createToken(tokenPayload);

  return {
    ...session,
    accessToken,
    refreshToken,
  };
};

const verifyEmailOtp = async (email: string, otp: string) => {
  const session = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  const tokenPayload = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    status: session.user.status,
    emailVerified: session.user.emailVerified,
  };

  const accessToken = jwtUtils.createToken(tokenPayload);
  const refreshToken = jwtUtils.createToken(tokenPayload);

  return {
    ...session,
    accessToken,
    refreshToken,
  };
};

const logout = async (sessionToken: string) => {
  const session = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });
  return session;
};

const newRefreshToken = async (refreshToken: string, sessionToken: string) => {
  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    throw new AppError("Invalid session token", 401);
  }

  const MAX_LIFE = 30 * 24 * 60 * 60 * 1000;

  if (Date.now() >= session.createdAt.getTime() + MAX_LIFE) {
    throw new AppError("Session token expired", 401);
  }

  const verifyRefreshToken = jwtUtils.verifyToken(refreshToken);

  if (!verifyRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const verifyRefreshTokenData = jwtUtils.decodeToken(
    refreshToken,
  ) as JwtPayload;

  const tokenPayload = {
    id: verifyRefreshTokenData?.data?.id,
    email: verifyRefreshTokenData?.data?.email,
    name: verifyRefreshTokenData?.data?.name,
    role: verifyRefreshTokenData?.data?.role,
    status: verifyRefreshTokenData?.data?.status,
    emailVerified: verifyRefreshTokenData?.data?.emailVerified,
  };

  const accessToken = jwtUtils.createToken(tokenPayload);
  const newRefreshToken = jwtUtils.createToken(tokenPayload);

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    token,
  };
};

export const authServices = {
  getLoggedInUser,
  login,
  register,
  logout,
  verifyEmailOtp,
  newRefreshToken,
};
