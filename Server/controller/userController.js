import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from"crypto";
import generateToken from "../middleware/generateToken.js";
import userModel from "../model/userModel.js";
import { logActivity } from "../utils/activityLogger.js";
import sendEmail from "../utils/sendEmail.js";
import Activity from "../model/activityLog.js";
import { registerSuccessTemplate } from "../templates/registerSuccessTemplate.js";


const handleGoogleAuth  = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        name,
        avatar,
        phone: "0000000000",
        address: "Not provided",
        answer: "Google login",
        password: "", 
        googleAuth: true,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set token in cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

const handleUpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email, phone } = req.body;
    const imageUrl = req.file?.path;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (imageUrl) updateData.avatar = imageUrl;

    const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Log the profile update activity
    await logActivity({
      userId: user._id,
      user: user.name || "Unknown User",
      action: "updated",
      item: "profile",
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // ✅ Log the failure
    await logActivity({
      userId: req.userId,
      user: "Unknown",
      action: "failed to update",
      item: "profile",
      status: "error",
    });

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Change Password
const handleChangePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    // ✅ Log activity
    await logActivity({
      userId: user._id,
      user: user.name || "Unknown User",
      action: "changed",
      item: "password",
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error.message);

    // ✅ Log failed attempt
    await logActivity({
      userId: req.userId,
      user: "Unknown",
      action: "failed to change",
      item: "password",
      status: "error",
    });

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId; 

    const user = await userModel.findById(userId).select("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Notifications fetched successfully.",
      notifications: user.notifications || [],
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

 const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { index } = req.params;

    const user = await userModel.findById(userId);
    if (!user || !user.notifications || !user.notifications[index]) {
      return res.status(404).json({ message: "Notification not found." });
    }

    user.notifications[index].read = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read." });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.notifications = [];
    await user.save();

    res.status(200).json({ message: "All notifications cleared." });
  } catch (error) {
    console.error("Clear notifications error:", error);
    res.status(500).json({ message: "Failed to clear notifications." });
  }
};
// ✅ Login
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ message: "Password does not match" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }
    

    const token = await generateToken(user._id);
   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.status(200).json({
    success: true,
    message: "Login successful",
    token, 
    user,
  });

  } catch (error) {
    console.error("Failed to login:", error);
    res.status(500).send({ message: "Login failed. Try again." });
  }
};

// ✅ Register
const handleUserRegister = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password too weak (min 8 characters)" });
    }

    const user = new userModel({ email, password, name, phone });
    await user.save();

    const emailStatus = await sendEmail({
     to: user.email,
     subject: "🎉 Welcome to Emmrex Bookstore",
     html: registerSuccessTemplate(user.name),
});


    res.status(200).send({
      message: "User registered successfully",
      emailStatus,
      user: {
        _id: user._id,
        email,
        phone,
        name,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).send({ message: "Registration failed" });
  }
};

// ✅ Get all users
const handleGetAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "all";
    const role = req.query.role || "all";

    // Build the filter object
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.isActive = status === "active";
    }

    if (role !== "all") {
      query.role = role;
    }

    const users = await userModel
      .find(query, "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count for hasMore
    const total = await userModel.countDocuments(query);
    const hasMore = skip + users.length < total;

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


const handleUpdateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    const adminId = req.userId;

    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // ✅ Send email only if email exists
    if (user?.email?.trim()) {
      const emailSubject = "Account Update Notification";
      const emailBody = `
        Hello ${user.username || "User"},
        
        Your account has been updated by an admin. The changes are:
        ${role ? `- Role: ${role}\n` : ""}
        ${status ? `- Status: ${status}\n` : ""}

        If you have any concerns, please contact support.

        Regards,
        Bookstore Admin Team
      `;
      await sendEmail(user.email.trim(), emailSubject, emailBody);
    }
    

    // ✅ Log activity
    await Activity.create({
      userId: adminId,
      action: `Admin updated user ${user.email} - Role: ${role || "unchanged"}, Status: ${status || "unchanged"}`,
    });

    res.status(200).send({
      message: "User updated successfully and notified via email.",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user." });
  }
};


// ✅ Delete user
const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};

// ✅ Admin Login
const handleAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Not an admin" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Token generation
    const token = await generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Admin login failed:", error);
    res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    // ✅ Log account deactivation
    await Activity.create({
      userId: user._id,
      user: user.username || user.email,
      avatar: user.avatar || "",
      action: "Deactivated own account",
      item: `User: ${user.email}`,
      status: "warning",
    });

    // ✅ Clear JWT cookie on deactivation
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during deactivation" });
  }
};


// ✅ Reactivate Account (Admin Only)
const handleReactivateAccount = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const performedBy = req.userId;

    const user = await userModel.findById(targetUserId);
    const admin = await userModel.findById(performedBy); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ success: false, message: "Account is already active" });
    }

    user.isActive = true;
    await user.save();

    // ✅ Log reactivation to Activity collection
    await Activity.create({
      userId: performedBy,
      user: admin?.username || admin?.email,  
      avatar: admin?.avatar || "",            
      action: "Reactivated a user account",
      item: `User: ${user.email}`,
      status: "success",
    });

    res.status(200).json({
      success: true,
      message: "User account reactivated successfully",
    });
  } catch (error) {
    console.error("Reactivation error:", error);
    res.status(500).json({ success: false, message: "Failed to reactivate account" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email." });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save hashed token to DB with expiry
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Construct reset link
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email message
    const message = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://res.cloudinary.com/dwhx6woy3/image/upload/v1753202544/iu7bg4g8aby5ifs94xow.png" alt="Bookstore Logo" style="width: 100px; height: auto;" />
    </div>

    <h2 style="color: #007bff;">Hi ${user.name},</h2>

    <p>You requested to reset your password. Click the button below to proceed:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>

    <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
    <p style="word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></p>

    <p>This link will expire in <strong>10 minutes</strong>.</p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />

    <p style="font-size: 14px; color: #999;">If you didn't request this password reset, you can safely ignore this email.</p>
    
    <p style="font-size: 14px; color: #999;">— The Bookstore Team</p>
  </div>
`;


await sendEmail({
  to: user.email,
  subject: "Password Reset Request",
  text: `Hello ${user.username}, reset your password here: ${resetUrl}`,
  html: message,
});

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
};

 const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired" });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
};



export {
  handleUserLogin,
  handleUserRegister,
  handleGetAllUsers,
  handleUpdateUserByAdmin,
  handleDeleteUser,
  handleGoogleAuth,
  handleUpdateProfile,
  handleChangePassword,
  deactivateAccount,
  handleReactivateAccount,
  handleLogout ,
  handleAdminLogin,
  getUserNotifications,
  markNotificationAsRead,
  forgotPassword,
  resetPassword,
  clearAllNotifications,
};
