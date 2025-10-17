// controllers/reportController.js
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";

// ✅ Total Sales (monthly, yearly)
export const getTotalSales = async (req, res) => {
  try {
    const { month, year } = req.query; // optional query parameters

    let filter = {};
    if (month && year) {
      filter.date = {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`)
      };
    } else if (year) {
      filter.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      };
    }

    const result = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" }
        }
      }
    ]);

    res.json({ totalSales: result[0]?.totalSales || 0 });
  } catch (error) {
    res.status(500).json({ message: "Error calculating total sales", error });
  }
};

// ✅ Profit = Sales – Expenses
export const getProfit = async (req, res) => {
  try {
    const invoices = await Invoice.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$grandTotal" } } }
    ]);
    const expenses = await Expense.aggregate([
      { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);

    const totalSales = invoices[0]?.totalSales || 0;
    const totalExpense = expenses[0]?.totalExpense || 0;
    const profit = totalSales - totalExpense;

    res.json({ totalSales, totalExpense, profit });
  } catch (error) {
    res.status(500).json({ message: "Error calculating profit", error });
  }
};

// ✅ Top Selling Products
export const getTopProducts = async (req, res) => {
  try {
    const products = await Invoice.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          totalQuantity: { $sum: "$products.quantity" },
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching top products", error });
  }
};
