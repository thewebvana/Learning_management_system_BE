
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const signupSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "Signup", required: true },
  customerName: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

signupSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

signupSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const customersSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creditLimit: { type: String, required: true },
},
  { timestamps: true }
)


const InvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customers", required: true },
  invoiceDate: { type: Date, required: true },
  invoiceAmount: { type: String, required: true },
  customerName: { type: String, required: true },
  itemsDetails: [
    {
      description: String,
      rate: Number,
      qty: Number,
      discount: Number,
      discountType: { type: String, enum: ["%", "₹"] },
      id: Number
    },
  ],
  adjustments: [
    {
      description: String,
      type: { type: String, enum: ["Add", "Less"] },
      amount: Number,
      id: Number
    },
  ],
  remark: { type: String }
},
  { timestamps: true }
)




module.exports = {
  Signup: mongoose.model("Signup", signupSchema),
  Customers: mongoose.model("Customers", customersSchema),
  Invoice: mongoose.model("Invoice", InvoiceSchema)
};
