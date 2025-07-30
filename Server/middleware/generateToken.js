import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const generateToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const JWT_SECRET = process.env.JWT_SECRET_KEY;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      throw new Error("JWT_SECRET_KEY or JWT_REFRESH_SECRET not defined in .env");
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens", error);
    throw error;
  }
};

export default generateToken;
