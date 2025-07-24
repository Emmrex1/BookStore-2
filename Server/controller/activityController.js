// // controllers/activityController.js

import Activity from "../model/activityLog.js";

export const getRecentActivities = async (req, res) => {
    try {
      const activities = await Activity.find()
        .sort({ createdAt: -1 })
        .limit(20); // Show last 20 actions
  
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error.message);
      res.status(500).json({ message: "Failed to load activities" });
    }
  };
  