import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";    // ✅ Day 5
import purchaseRoutes from "./routes/purchaseRoutes.js";  // ✅ Day 5
import reportRoutes from "./routes/reportRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use("/api/qr", qrRoutes);

// after other routes
app.use("/api/reports", reportRoutes);

app.use("/api/notifications", notificationRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
