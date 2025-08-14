import mongoose from "mongoose";

const DailyTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Scheduled"],
    default: "Pending",
  },
  date: { type: String, required: true },
  userId: { type: String, required: true }, // 👈 ensures user-specific data
});

export default mongoose.models.DailyTask ||
  mongoose.model("DailyTask", DailyTaskSchema);
