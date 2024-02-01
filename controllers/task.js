import { Task } from "../models/task.js";

export const addTask = async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      sucess: false,
      message: "fill all feilds",
    });
  }

  try {
    await Task.create({
      title,
      description,
      user: res.user,
    });

    res.status(201).json({
      sucess: true,
      message: "task added successfull",
    });
  } catch (error) {
    res.status(400).json({
      sucess: false,
      message: "task login first",
    });
  }
};

export const getAlltask = async (req, res) => {
  const userId = res.user._id;
  const task = await Task.find({ user: userId });
  res.status(200).json({
    success: true,
    message: "all user",
    task,
  });
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await Task.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
