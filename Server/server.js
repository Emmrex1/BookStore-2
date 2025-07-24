// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true, 
}));
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/auth",adminRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Test route
app.get("/", (req, res) => {
  res.send("API connected Successfully");
});

// Start server
app.listen(port, () => {
  console.log("Server running on PORT", port);
 
});
