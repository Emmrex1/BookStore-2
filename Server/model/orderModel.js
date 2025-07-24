import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
   trackingNumber: { type: String },
   status: { type: String, default: "Order Placed" },
   trackingStatus: [
  {
    status: { type: String, required: true },
    time: { type: Date, default: Date.now },
  }
],


  },
  { timestamps: true }
);

const OrderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default OrderModel;
