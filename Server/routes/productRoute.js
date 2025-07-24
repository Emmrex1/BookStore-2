import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controller/productController.js"
import upload from '../middleware/multer.js'
import isAdmin from '../middleware/isAdmin.js';
import verifyToken from '../middleware/verifyToken.js';

const productRouter = express.Router()

productRouter.post('/create', upload.array("images", 5), createProduct);
productRouter.get('/list', getAllProducts)
productRouter.get('/:_id', getProductById);
productRouter.put("/update/:id",verifyToken,isAdmin, upload.array("images", 5), updateProduct);
productRouter.delete('/delete/:_id', deleteProduct)

export default productRouter;
