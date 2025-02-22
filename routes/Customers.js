const express = require("express");
const { Customers, Invoice } = require("../models/index");
const customerRouter = express.Router();

// Create a new customer
customerRouter.post("/customer", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingCustomer = await Customers.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exist with this email" });
    }

    const newCustomer = new Customers(req.body);
    await newCustomer.save();

    const customers = await Customers.find(); // Fetch updated list
    res.status(201).json({ message: "Customer created successfully", data: customers });
  } catch (error) {
    res.status(500).json({ message: "Error creating customer", error: error.message });
  }
});


// Get all customers
customerRouter.get("/customers", async (req, res) => {
  try {
    const customers = await Customers.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});

// Get a single customer by ID
customerRouter.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
});

// Update a customer by ID
customerRouter.post("/customers/:id", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is already used by another customer
    const existingCustomer = await Customers.findOne({ email });
    if (existingCustomer && existingCustomer._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Customer already exists with this email" });
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customers = await Customers.find(); // Fetch updated list
    res.status(200).json({ message: "Customer updated successfully", data: customers });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error: error.message });
  }
});


// Delete a customer by ID
customerRouter.delete("/customers/:id", async (req, res) => {
  try {

    const existingInvoice = await Invoice.findOne({ customerId: req.params.id });

    if (existingInvoice) {
      return res.status(400).json({ message: "Cannot delete customer. An invoice exists for this customer" });
    }

    const deletedCustomer = await Customers.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customers = await Customers.find(); // Fetch updated list
    res.status(200).json({ message: "Customer deleted successfully", data: customers });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error: error.message });
  }
});



customerRouter.get("/customerslist", async (req, res) => {
  try {
    const customers = await Customers.find().select("customerName _id");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
});



module.exports = customerRouter;
