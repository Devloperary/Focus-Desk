import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Scheduled"],
    default: "Pending",
  },
  date: { type: String, required: true },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
