import mongoose from "mongoose";
import Stripe from 'stripe';
import Activity from "../model/activityLog.js";
import NotificationModel from "../model/notificationsModel.js";
import OrderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";
import { logActivity } from "../utils/activityLogger.js";
import sendEmail from "../utils/sendEmail.js";



export const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // ✅ Ensure userId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // ✅ Get user info before using user?.name
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

// PLACE ORDER WITH STRIPE (TO BE IMPLEMENTED)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE ORDER WITH STRIPE
export const placeOrderStripe = async (req, res) => {
  try {
    const { cartItems, shippingInfo, userId, email } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create Stripe line items
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.booktitle,
          images: [item.imgurl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      metadata: {
        userId,
        shippingInfo: JSON.stringify(shippingInfo),
        cartItems: JSON.stringify(cartItems),
      },
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY STRIPE PAYMENT & CREATE ORDER (Webhook endpoint)
export const verifyStripe = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const cartItems = JSON.parse(session.metadata.cartItems);
      const shippingInfo = JSON.parse(session.metadata.shippingInfo);
      const userId = session.metadata.userId;

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const order = new OrderModel({
        user: userId,
        orderItems,
        shippingInfo,
        paymentMethod: "Stripe",
        paymentInfo: {
          id: session.payment_intent,
          status: "Paid",
        },
        totalPrice: cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        paidAt: new Date(),
        orderStatus: "Processing",
      });

      await order.save();

      console.log("✅ Order saved for user:", session.customer_email);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};


// GET ALL ORDERS (ADMIN)
 export const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await OrderModel.find({ user: id });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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