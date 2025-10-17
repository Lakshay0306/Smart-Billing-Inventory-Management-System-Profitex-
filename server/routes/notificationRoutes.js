import express from "express";
import { sendWhatsAppNotification } from "../utils/notifications.js";
const router = express.Router();

// Send WhatsApp notification
router.post("/whatsapp", async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message) {
    return res.status(400).json({ message: "Number and message are required." });
  }

  await sendWhatsAppNotification(number, message);
  res.json({ message: "Notification sent (or attempted)" });
});

export default router;
