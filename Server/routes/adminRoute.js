import express from 'express'
import { handleAdminLogin, handleDeleteUser, handleGetAllUsers, handleReactivateAccount, handleUpdateUserByAdmin } from '../controller/userController.js';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import { statsCard } from '../controller/cartController.js';
import { getRecentActivities } from '../controller/activityController.js';

const adminRouter = express.Router();
// Admin Only
adminRouter.post("/admin-login", handleAdminLogin);
adminRouter.get('/users', verifyToken, isAdmin, handleGetAllUsers);
adminRouter.patch('/reactivate/:id', verifyToken, isAdmin, handleReactivateAccount);
adminRouter.patch('/update/:id', verifyToken, isAdmin, handleUpdateUserByAdmin);
adminRouter.delete('/users/:id', verifyToken, isAdmin, handleDeleteUser);
// routes/adminRoutes.js
adminRouter.get("/dashboard-stats", verifyToken, isAdmin, statsCard);
adminRouter.get("/activities", verifyToken, isAdmin, getRecentActivities);




export default adminRouter;
