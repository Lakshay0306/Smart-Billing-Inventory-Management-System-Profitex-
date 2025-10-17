// routes/purchaseRoutes.js
import express from "express";
import {
  addPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase
} from "../controllers/purchaseController.js";

const router = express.Router();

// ✅ Order matters
router.get("/", getPurchases);
router.get("/:id", getPurchaseById);
router.post("/", addPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

export default router;
