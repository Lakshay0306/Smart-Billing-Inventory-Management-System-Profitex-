// controllers/purchaseController.js
import Purchase from "../models/Purchase.js";

// 🧾 Create Purchase
export const addPurchase = async (req, res) => {
  try {
    const { supplier, items, totalCost, date } = req.body;

    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ message: "Supplier and items are required." });
    }

    const purchase = new Purchase({
      supplier,
      items,
      totalCost,
      date: date || new Date(),
    });

    await purchase.save();
    res.status(201).json({ message: "✅ Purchase added successfully", purchase });
  } catch (error) {
    console.error("❌ Error adding purchase:", error);
    res.status(500).json({ message: "Error adding purchase", error: error.message });
  }
};

// 📋 Get All Purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    console.error("❌ Error fetching purchases:", error);
    res.status(500).json({ message: "Error fetching purchases", error: error.message });
  }
};

// 🔍 Get Single Purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    console.log("🟢 Hit GET /api/purchases/:id route");
    console.log("Requested ID:", req.params.id);

    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      console.log("❌ Purchase not found in DB");
      return res.status(404).json({ message: "Purchase not found" });
    }

    console.log("✅ Purchase found:", purchase);
    res.json(purchase);
  } catch (error) {
    console.error("🔥 Error fetching purchase:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✏️ Update Purchase
export const updatePurchase = async (req, res) => {
  try {
    const { supplier, items, totalCost, date } = req.body;
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { supplier, items, totalCost, date },
      { new: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json({ message: "✅ Purchase updated successfully", purchase });
  } catch (error) {
    console.error("❌ Error updating purchase:", error);
    res.status(500).json({ message: "Error updating purchase", error: error.message });
  }
};

// 🗑️ Delete Purchase
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json 
      ({ message: "Purchase not found" });
    }   
    res.json({ message: "✅ Purchase deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting purchase:", error);
    res.status(500).json({ message: "Error deleting purchase", error: error.message });
  }   
};

