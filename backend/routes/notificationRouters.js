const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendnotification,
  getnotification,
  updatenotification,
} = require("../controllers/notificationController");

const router = express.Router();
router.route("/").post(protect, sendnotification);
router.route("/").get(protect, getnotification);
router.route("/:ChatId").put(protect, updatenotification);

module.exports = router;
