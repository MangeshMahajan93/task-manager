const express = require("express");
const Task = require("../models/Task");
const { auth, roleCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, roleCheck("Admin", "Manager"), async (req, res) => {
  const { title, description, status, assignee } = req.body;
  const task = new Task({ title, description, status, assignee, createdBy: req.user.userId });
  await task.save();
  res.status(201).json({ message: "Task created successfully", task });
});

router.get("/", auth, async (req, res) => {
  let filter = {};
  if (req.user.role === "User") {
    filter.assignee = req.user.userId;
  } else if (req.user.role === "Manager") {
    filter = { $or: [{ createdBy: req.user.userId }, { assignee: req.user.userId }] };
  }
  const { page = 1, limit = 10 } = req.query;
  const tasks = await Task.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.json({ message: "Tasks retrieved successfully", tasks });
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role !== "Admin" && task.createdBy.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized to update this task" });
  }

  Object.assign(task, req.body);
  await task.save();
  res.json({ message: "Task updated successfully", updatedTask: task });
});

router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  if (req.user.role !== "Admin" && task.createdBy.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Unauthorized to delete this task" });
  }
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted successfully", deletedTaskId: task._id });
});
module.exports = router;