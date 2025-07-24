import express from 'express';
import { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe } from '../controller/orderController.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';



const orderRouter = express.Router();

orderRouter.post("/place",verifyToken, placeOrder);
orderRouter.post("/stripe",verifyToken, placeOrderStripe)
orderRouter.post("/verifystripe",verifyToken, verifyStripe)

orderRouter.post("/userorders",verifyToken, userOrders)

orderRouter.post("/status", verifyToken, isAdmin, updateStatus)
orderRouter.post("/list", verifyToken,isAdmin, allOrders);





export default orderRouter;