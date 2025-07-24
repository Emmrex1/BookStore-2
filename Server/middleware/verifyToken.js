
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
console.log("JWT_SECRET",JWT_SECRET)

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;  

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default verifyToken;
