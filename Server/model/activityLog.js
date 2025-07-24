
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: String, 
    avatar: String, 
    action: { type: String, required: true }, 
    item: String,   
    status: {
      type: String,
      enum: ["success", "warning", "error", "info"],
      default: "info",
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
