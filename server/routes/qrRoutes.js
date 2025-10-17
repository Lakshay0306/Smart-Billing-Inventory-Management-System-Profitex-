import express from "express";
const router = express.Router();

// Placeholder QR login
router.get("/login", (req, res) => {
  res.json({ message: "QR login placeholder — feature coming in next sprint" });
});

export default router;
