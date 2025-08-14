import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, default: "Pending" },
  date: { type: String, required: true }, // toDateString() format
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
