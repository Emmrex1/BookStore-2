import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

const generateToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const JWT_SECRET = process.env.JWT_SECRET_KEY;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not defined in .env");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (error) {
    console.error("Error generating Token", error);
    throw error;
  }
};

export default generateToken;
