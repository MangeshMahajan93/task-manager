const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["Pending","Inprogres", "Completed"], default: "Pending" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ createdBy: 1 });
module.exports = mongoose.model("Task", TaskSchema);