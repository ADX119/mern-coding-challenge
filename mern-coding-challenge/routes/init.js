const express = require("express");
const router = express.Router();
const axios = require("axios");
const Transaction = require("../models/Transaction");

router.get("/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = response.data;
     data.forEach((item) => {
       item.dateOfSale = new Date(item.dateOfSale); // Assuming dateOfSale is a string date
     });

    await Transaction.deleteMany({});
    await Transaction.insertMany(data);

    res.status(200).json({ message: "Database initialized with seed data" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
