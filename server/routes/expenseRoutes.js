// routes/expenseRoutes.js
import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseSummary,
  getExpenseById,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/summary", getExpenseSummary); // put BEFORE /:id
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
