import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  date: String, // Store as toDateString() for simplicity
});

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
