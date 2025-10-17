// controllers/expenseController.js
import Expense from "../models/Expense.js";
import mongoose from "mongoose";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const expense = new Expense({ title, amount, category, date });
    await expense.save();
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding expense", error });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

export const getExpenseSummary = async (req, res) => {
  try {
    // example: monthly total and top category by amount
    const month = parseInt(req.query.month) || (new Date()).getMonth() + 1; // 1-12
    const year = parseInt(req.query.year) || (new Date()).getFullYear();

    const pipeline = [
      {
        $match: {
          date: {
            $gte: new Date(`${year}-${String(month).padStart(2, "0")}-01`),
            $lt: new Date(new Date(`${year}-${String(month).padStart(2, "0")}-01`).setMonth(month))
          }
        }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ];

    const result = await Expense.aggregate(pipeline);
    const totalMonthlyExpense = result.reduce((sum, r) => sum + r.totalAmount, 0);
    const topCategory = result.length ? result[0]._id : null;

    res.json({ totalMonthlyExpense, topCategory, breakdown: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating summary", error });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id format" });
    }

    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense updated", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating expense", error });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
