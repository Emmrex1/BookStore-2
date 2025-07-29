import mongoose from "mongoose";
import Stripe from 'stripe';
import Activity from "../model/activityLog.js";
import NotificationModel from "../model/notificationsModel.js";
import OrderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";
import { logActivity } from "../utils/activityLogger.js";
import sendEmail from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DELIVERY_FEE = 1000; // in cents
const CURRENCY = "usd";


export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(userId);

    const orderData = {
      userId: user._id, 
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    // ✅ Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: [] });

    // ✅ Notify all admins about new order
    const admin = await userModel.findOne({ role: "admin" }); 
if (admin) {
  const adminNotification = new NotificationModel({
    user: admin._id,  
    type: "order",
    message: `New order placed by ${user?.name || "Unknown User"}.`,
  });
  await adminNotification.save();
}


    // ✅ Log activity
    await logActivity({
      userId: user._id,
      user: user?.name || "Unknown",
      action: "placed",
      item: "order",
      status: "success",
    });

    res.json({ success: true, message: "Order placed" });
    
  } catch (error) {
    console.log("❌ Place order error:", error);

    await logActivity({
      userId: req.body.userId,
      user: "Unknown",
      action: "failed to place",
      item: "order",
      status: "error",
    });

    res.status(500).json({ success: false, message: error.message });
  }
};

// PLACE ORDER WITH STRIPE
export const placeOrderStripe = async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const origin = req.headers.origin;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const order = await OrderModel.create({
    userId,
    items,
    amount,
    address,
    paymentMethod: "Stripe",
    payment: false,
    date: Date.now(),
  });

  const line_items = items.map(item => ({
    price_data: {
      currency: CURRENCY,
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  line_items.push({
    price_data: {
      currency: CURRENCY,
      product_data: { name: "Delivery charges" },
      unit_amount: DELIVERY_FEE,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${origin}/verify?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/verify?orderId=${order._id}&canceled=true`,
    line_items,
    metadata: { orderId: order._id.toString() },
  });

  res.json({ success: true, sessionUrl: session.url });
};

// VERIFY STRIPE PAYMENT & CREATE ORDER (Webhook endpoint)
export const verifyCheckoutSession = async (req, res) => {
  const { session_id, orderId } = req.query;

  if (!session_id || !orderId) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const order = await OrderModel.findById(orderId);

      if (order && !order.payment) {
        order.payment = true;
        order.status = "Paid";
        await order.save();

        const user = await userModel.findById(order.userId);

        await NotificationModel.create({
          user: order.userId,
          type: "order",
          message: `Your payment for order ${orderId} was verified.`,
        });

        await logActivity({
          userId: order.userId,
          user: user?.name || "Unknown",
          action: "manual stripe verify",
          item: "order",
          status: "success",
        });

        if (user?.email?.trim()) {
          await sendEmail({
            to: user.email.trim(),
            subject: "Order Verified",
            html: `<h3>Hi ${user.name},</h3><p>Your payment for order <b>${orderId}</b> has been verified. Thank you!</p>`,
          });
        }
      }

      return res.json({ success: true, message: "Payment verified", session });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Stripe verify error:", error.message);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
};

// GET ALL ORDERS (ADMIN)
export const allOrders = async (req, res) => {
  const orders = await OrderModel.find().populate("userId", "name email").sort("-createdAt");
  res.json({ success: true, orders });
};


// GET USER ORDERS
export const userOrders = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const orders = await OrderModel.find({ userId: id }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// UPDATE ORDER STATUS
export const updateStatus = async (req, res) => {
  try {
    const adminId = req.userId;
    const { orderId, status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate({ path: "userId", select: "name email" });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const customer = updatedOrder.userId;

    await Activity.create({
      userId: adminId,
      action: "update",
      section: "Order",
      description: `Changed order status to "${status}" for order ID ${orderId}`,
    });

    await NotificationModel.create({
      user: customer._id,
      type: "order",
      message: `Your order (ID: ${orderId}) status has been updated to "${status}".`,
    });

    if (customer?.email?.trim()) {
      await sendEmail({
        to: customer.email.trim(),
        subject: "Order Status Updated",
        text: `Hi ${customer.name},\n\nYour order status has been updated to "${status}".\n\nThank you for shopping with us!`,
      });
    }

    const admins = await userModel.find({
      role: "admin",
      _id: { $ne: adminId },
    });

    const adminNotifications = admins.map((admin) => ({
      user: admin._id,
      type: "order",
      message: `Order ID ${orderId} status has been updated to "${status}".`,
    }));

    if (adminNotifications.length > 0) {
      await NotificationModel.insertMany(adminNotifications);
    }

    // Fixed 4: Use options object + validate email
    for (const admin of admins) {
      if (admin?.email?.trim()) {
        await sendEmail({
          to: admin.email.trim(),
          subject: "Order Update Notification",
          text: `Hello ${admin.name},\n\nOrder ID ${orderId} status has been updated to "${status}" by another admin.\n\nCheck your dashboard for more details.`,
        });
      }
    }

    return res.json({
      success: true,
      message: "Order status updated. Notifications sent to customer and admins.",
    });
  } catch (error) {
    console.error("❌ updateStatus error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};