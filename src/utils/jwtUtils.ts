import jwt from "jsonwebtoken";

// import jwt from "jsonwebtoken"
const verifyToken = (token: string) => {
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    if (verified) {
      return {
        success: true,
        error: null,
      };
    } else {
      return {
        success: false,
        error: "Invalid token",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return {
      success: true,
      error: null,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      data: null,
    };
  }
};

const createToken = (payload: any) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

export const jwtUtils = {
  verifyToken,
  decodeToken,
  createToken,
};
