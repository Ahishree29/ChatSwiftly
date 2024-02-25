const Express = require("express");
const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const sendnotification = asyncHandler(async (req, res) => {
  const { senderId, chatId } = req.body;

  const newNotification = {
    sender: senderId,
    reciver: req.user._id,
    chat: chatId,
  };
  try {
    const existingNotification = await Notification.find({
      chat: chatId,
      reciver: req.user._id,
      sender: senderId,
    });
    if (existingNotification.length > 0) {
      return res.status(200).json(existingNotification);
    } else {
      var notify = await Notification.create(newNotification);
      notify = await notify.populate("sender", "name pic");
      notify = await notify.populate("chat");

      res.json(notify);
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getnotification = asyncHandler(async (req, res) => {
  try {
    var notification = await Notification.find({ reciver: req.user._id })
      .populate("sender", "name pic email")
      .populate("chat");
    notification = await User.populate(notification, {
      path: "chat.users",
      select: "name pic email",
    });

    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const updatenotification = asyncHandler(async (req, res) => {
  try {
    console.log("hey there i am triggered");
    const selectedNotification = await Notification.findOne({
      chat: req.params.ChatId,
      reciver: req.user._id,
    });

    if (!selectedNotification) {
      res.status(400);
      throw new Error("chat not found");
    }
    const removeNotification = await Notification.deleteOne({
      _id: selectedNotification._id,
    });

    var notification = await Notification.find({ reciver: req.user._id })
      .populate("sender", "name pic email")
      .populate("chat");
    notification = await User.populate(notification, {
      path: "chat.users",
      select: "name pic email",
    });

    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { sendnotification, getnotification, updatenotification };
