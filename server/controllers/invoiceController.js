import Invoice from "../models/Invoice.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { customerName, products } = req.body;

    if (!customerName || !products || products.length === 0) {
      return res.status(400).json({ message: "Customer name and products are required." });
    }

    let totalAmount = 0,
      gstAmount = 0;

    products.forEach((p) => {
      totalAmount += p.price * p.quantity;
      gstAmount += (p.price * p.quantity * p.gst) / 100;
    });

    const grandTotal = totalAmount + gstAmount;
    const invoiceCount = await Invoice.countDocuments();
    const invoiceNo = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

    const invoice = new Invoice({
      invoiceNo,
      customerName,
      products,
      totalAmount,
      gstAmount,
      grandTotal,
    });

    await invoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ message: "Error creating invoice", error });
  }
};

// ✅ Generate Professional PDF with page breaks & numbers
export const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const pdfDir = path.join(__dirname, "../public/invoices");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const pdfPath = path.join(pdfDir, `${invoice.invoiceNo}.pdf`);
    const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.pipe(res);

    const logoPath = path.join(__dirname, "../public/logo.png");
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Header function
    const addHeader = () => {
      if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 45, { width: 100 });
      doc.fontSize(20).text("Profitex - Smart Billing System", 200, 50, { align: "right" });
      doc.moveDown(2);
    };

    // Footer function with page number
    const addFooter = () => {
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(10).font("Helvetica-Oblique")
          .text(`Page ${i + 1} of ${range.count}`, 50, pageHeight - 50, { align: "center" });
      }
    };

    addHeader();

    // Customer info
    doc.fontSize(12);
    doc.text(`Invoice No: ${invoice.invoiceNo}`, { continued: true })
      .text(`  Date: ${new Date(invoice.date).toLocaleDateString()}`, { align: "right" });
    doc.text(`Customer: ${invoice.customerName}`);
    doc.moveDown();

    // Table header
    const tableTop = doc.y + 5;
    const headers = ["No", "Name", "Price", "Qty", "GST %", "Amount"];
    const positions = [50, 80, 250, 300, 350, 420];
    headers.forEach((header, i) => {
      doc.font("Helvetica-Bold").text(header, positions[i], tableTop);
    });
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table rows
    let rowY = tableTop + 20;
    invoice.products.forEach((p, i) => {
      const amount = p.price * p.quantity + (p.price * p.quantity * p.gst) / 100;

      // Check if next row goes beyond page, add new page
      if (rowY + 20 > pageHeight - 100) {
        doc.addPage();
        rowY = 50;
        addHeader();
      }

      doc.font("Helvetica").text(i + 1, positions[0], rowY);
      doc.text(p.name, positions[1], rowY);
      doc.text(`₹${p.price.toFixed(2)}`, positions[2], rowY);
      doc.text(p.quantity, positions[3], rowY);
      doc.text(`${p.gst}%`, positions[4], rowY);
      doc.text(`₹${amount.toFixed(2)}`, positions[5], rowY);

      rowY += 20;
      doc.moveTo(50, rowY - 5).lineTo(550, rowY - 5).strokeColor("#cccccc").stroke();
    });

    rowY += 20;
    // Totals
    doc.font("Helvetica-Bold").text(`Total Amount: ₹${invoice.totalAmount.toFixed(2)}`, 400, rowY);
    doc.text(`GST: ₹${invoice.gstAmount.toFixed(2)}`, 400, rowY + 20);
    doc.text(`Grand Total: ₹${invoice.grandTotal.toFixed(2)}`, 400, rowY + 40);

    // Footer
    doc.fontSize(10).font("Helvetica-Oblique")
      .text("Thank you for your business!", 50, pageHeight - 40, { align: "center" });

    doc.end();
    addFooter();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error });
  }
};

// ✅ Get Invoice JSON by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
