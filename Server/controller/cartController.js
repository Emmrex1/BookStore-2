import orderModel from '../model/orderModel.js';
import userModel from '../model/userModel.js';
import mongoose from 'mongoose';


export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // ✅ Validate IDs
    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid User ID or Product ID" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Convert legacy object-based cart to array format
    if (!Array.isArray(user.cartData)) {
      const converted = [];
      for (const [id, qty] of Object.entries(user.cartData || {})) {
        if (mongoose.Types.ObjectId.isValid(id)) {
          converted.push({
            productId: new mongoose.Types.ObjectId(id),
            quantity: Number(qty) || 1,
          });
        }
      }
      user.cartData = converted;
    }

    // ✅ Check if item already exists in cart
    const existingItem = user.cartData.find(
      (item) => item?.productId?.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartData.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity: 1,
      });
    }

    // ✅ Clean up: Remove invalid items
    user.cartData = user.cartData.filter(
      (item) =>
        mongoose.Types.ObjectId.isValid(item?.productId) &&
        item.quantity > 0
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: user.cartData,
    });
  } catch (error) {
    console.error("🛑 Add to cart error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Cart
export const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "User ID, Product ID, and valid quantity are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid User ID or Product ID" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cartData.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      user.cartData.splice(itemIndex, 1); 
    } else {
      user.cartData[itemIndex].quantity = quantity;
    }

    await user.save();
    res.status(200).json({ success: true, message: "Cart updated", cart: user.cartData });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Cart
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid User ID is required" });
    }

    const user = await userModel.findById(userId).populate("cartData.productId");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      cart: user.cartData,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const syncCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid sync data" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalize input cart
    const mergedCart = [];

    for (const item of cartItems) {
      const { productId, quantity } = item;
      if (!mongoose.Types.ObjectId.isValid(productId) || quantity <= 0) continue;

      const existing = user.cartData.find(
        (i) => i.productId.toString() === productId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        user.cartData.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity,
        });
      }
    }

    // Filter out any invalid cart items
    user.cartData = user.cartData.filter(
      (item) => mongoose.Types.ObjectId.isValid(item?.productId) && item.quantity > 0
    );

    await user.save();

    res.status(200).json({ success: true, message: "Cart synced successfully", cart: user.cartData });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Filter out the item to be removed
    user.cartData = user.cartData.filter((item) => item.productId.toString() !== itemId);
    await user.save();

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("Delete cart item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// controller/cartController.js
export const statsCard = async (req, res) => {
  try {
    const totalRevenueAgg = await orderModel.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const activeUsers = await userModel.countDocuments({ isActive: true });
    const totalOrders = await orderModel.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        activeUsers,
        totalOrders,
        pageViews: 98234,
      },
    });
  } catch (error) {
    console.error("📉 Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};
