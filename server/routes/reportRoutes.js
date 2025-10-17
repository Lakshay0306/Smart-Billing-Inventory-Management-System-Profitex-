// routes/reportRoutes.js
import express from "express";
import { getTotalSales, getProfit, getTopProducts } from "../controllers/reportController.js";

const router = express.Router();

router.get("/totalsales", getTotalSales);
router.get("/profit", getProfit);
router.get("/top-products", getTopProducts);

export default router;
