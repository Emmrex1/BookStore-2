import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: { type: [String], required: true }, 
  price: { type: Number, required: true },
  date: { type: Number, required: true },
  popular: { type: Boolean },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
