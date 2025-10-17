import express from "express";
import { createInvoice, generateInvoicePDF, getInvoiceById } from "../controllers/invoiceController.js";

const router = express.Router();

// Create invoice
router.post("/", createInvoice);

// Generate PDF
router.get("/:id/pdf", generateInvoicePDF);

// Get invoice JSON (for frontend)
router.get("/:id", getInvoiceById);

export default router;
