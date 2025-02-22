const express = require("express");
const { Invoice } = require("../models/index");
const dashboardRouter = express.Router();



dashboardRouter.get("/dashboard", async (req, res) => {
  try {
    const [totalSalesResult, monthlySales, topCustomers] = await Promise.all([
      // Get Total Sales
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: { $toDouble: "$invoiceAmount" } }
          }
        }
      ]),

      // Get Monthly Sales
      Invoice.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$invoiceDate" },
              month: { $month: "$invoiceDate" }
            },
            sales: { $sum: { $toDouble: "$invoiceAmount" } }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),

      // Get Top 10 Performing Customers
      Invoice.aggregate([
        {
          $group: {
            _id: "$customerName",
            totalPurchase: { $sum: { $toDouble: "$invoiceAmount" } }
          }
        },
        { $sort: { totalPurchase: -1 } },
        { $limit: 10 } 
      ])
    ]);

    // Format Monthly Sales Data
    const formattedMonthlySales = monthlySales.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleString("default", { month: "short", year: "numeric" }),
      sales: item.sales
    }));

    // Format Top Customers Data
    const formattedTopCustomers = topCustomers.map(item => ({
      customerName: item._id,
      totalPurchase: item.totalPurchase
    }));

    res.status(200).json({
      totalSales: totalSalesResult[0]?.totalSales || 0,
      monthlySales: formattedMonthlySales,
      topCustomers: formattedTopCustomers
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales data", error: error.message });
  }
});



module.exports = dashboardRouter;