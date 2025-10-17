import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  supplier: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalCost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Purchase", purchaseSchema);
