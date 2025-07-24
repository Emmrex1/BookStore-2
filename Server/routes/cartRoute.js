import express from 'express';
import {addToCart,  deleteCartItem,  getUserCart, statsCard, syncCart, updateCart} from "../controller/cartController.js"



const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.post("/get", getUserCart)
cartRouter.patch("/update", updateCart)
cartRouter.post("/sync", syncCart);
cartRouter.post("/delete-item", deleteCartItem)
cartRouter.get("/dashboard-stats", statsCard)









export default cartRouter;