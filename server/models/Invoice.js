import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  gst: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  products: [productSchema],
  totalAmount: Number,
  gstAmount: Number,
  grandTotal: Number,
});

export default mongoose.model("Invoice", invoiceSchema);
