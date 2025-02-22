const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken')

const router = require("./routes/index");
const customerRouter = require("./routes/Customers");
const invoiceRouter = require("./routes/Invoices");
const dashboardRouter = require("./routes/Dashboard");


const app = express();
const PORT = process.env.PORT || 5000
const CONNECTION_STRING = process.env.CONNECTION_STRING
const JWT_SECRET = process.env.JWT_SECRET

const corsOptions = {
  origin: ["http://localhost:3000", "https://yourfrontenddomain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


const authenticateToken = (req, res, next) => {
  const openRoutes = ["/api/login", "/api/signup"];
  if (openRoutes.includes(req.path)) return next()

  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access Denied: No Token Provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};




// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(authenticateToken);


// MongoDB connection
mongoose
  .connect( CONNECTION_STRING , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/", router);
app.use("/api/", customerRouter);
app.use("/api/", invoiceRouter);
app.use("/api/", dashboardRouter);

router.get("/test", (req, res) => {
  res.status(200).send("BE working fine!");
})


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
