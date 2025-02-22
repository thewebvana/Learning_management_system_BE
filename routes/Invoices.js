const express = require("express");
const { Invoice } = require("../models/index");  
const invoiceRouter = express.Router();

// Create Invoice
invoiceRouter.post("/invoices", async (req, res) => {
  try {
    const existingInvoice = await Invoice.findOne({ invoiceNo: req.body.invoiceNo });

    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }

    const invoice = new Invoice(req.body);
    await invoice.save();

    const invoices = await Invoice.find()
    res.status(201).json({ message: "Invoice created successfully", data: invoices });
  } catch (error) {
    res.status(400).json({ message: "Error creating invoice", error: error.message });
  }
});

// Get All Invoices
invoiceRouter.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error: error.message });
  }
});

// Get Single Invoice by ID
invoiceRouter.get("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error: error.message });
  }
});

// Update Invoice
invoiceRouter.post("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const invoices = await Invoice.find()
    res.status(200).json({ message: "Invoice updated successfully", data: invoices });
  } catch (error) {
    res.status(400).json({ message: "Error updating invoice", error: error.message });
  }
});

// Delete Invoice
invoiceRouter.delete("/invoices/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const invoices = await Invoice.find()
    res.status(200).json({ message: "Invoice deleted successfully", data: invoices });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error: error.message });
  }
});

module.exports = invoiceRouter
