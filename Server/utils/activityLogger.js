import Activity from "../model/activityLog.js";


export const logActivity = async ({ userId, user, action, item, status = "info" }) => {
  try {
    const initials = user
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    await Activity.create({
      userId,
      user,
      avatar: initials,
      action,
      item,
      status,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};
