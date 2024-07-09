const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  category: String,
  dateOfSale: String,
  sold: Boolean,
});

module.exports = mongoose.model("Transaction", transactionSchema);
