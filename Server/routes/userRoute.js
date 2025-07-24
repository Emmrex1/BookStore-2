import express from 'express';
import {
  
  handleUserLogin,
  handleUserRegister,
  handleGoogleAuth,
  handleUpdateProfile,
  handleLogout,
  handleChangePassword,
  deactivateAccount,
  getUserNotifications,
  clearAllNotifications,
  markNotificationAsRead,
  forgotPassword,
  resetPassword,

} from '../controller/userController.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/multer.js';


const userRouter = express.Router();

// Public
userRouter.post('/register', handleUserRegister);
userRouter.post('/login', handleUserLogin);
userRouter.post('/google-auth', handleGoogleAuth);
userRouter.post("/logout", handleLogout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// Authenticated User
userRouter.patch("/update-profile", verifyToken, upload.single("image"), handleUpdateProfile);
userRouter.patch("/change-password", verifyToken, handleChangePassword);
userRouter.patch("/deactivate", verifyToken, deactivateAccount);
userRouter.get("/notifications", verifyToken, getUserNotifications);
userRouter.delete("/notifications", verifyToken, clearAllNotifications);
userRouter.patch("/notifications/:index/read", verifyToken, markNotificationAsRead);

//  "multer-storage-cloudinary": "^4.0.0",
//  "cloudinary": "^2.7.0",

export default userRouter;
