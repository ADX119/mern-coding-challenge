const express = require("express");
const router = express.Router();
const axios = require("axios");
const Transaction = require("../models/Transaction");

router.get("/transactions", async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "", month, year } = req.query;
    const regex = new RegExp(search, "i");

    let query = {
      $or: [{ title: regex }, { description: regex }, { price: regex }],
    };

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      query = {
        ...query,
        dateOfSale: { $gte: startDate, $lt: endDate },
      };
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/statistics", async (req, res) => {
  try {
    const { month, year } = req.query;

    let match = {};

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      match = { dateOfSale: { $gte: startDate, $lt: endDate } };
    }

    const totalSaleAmount = await Transaction.aggregate([
      { $match: { ...match, sold: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      ...match,
      sold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      ...match,
      sold: false,
    });

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/bar-chart", async (req, res) => {
  try {
    const { month, year } = req.query;

    let match = {};

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      match = { dateOfSale: { $gte: startDate, $lt: endDate } };
    }

    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const results = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...match,
          price: { $gte: min, $lt: max === Infinity ? undefined : max },
        });
        return { range, count };
      })
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/pie-chart", async (req, res) => {
  try {
    const { month, year } = req.query;

    let match = {};

    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      match = { dateOfSale: { $gte: startDate, $lt: endDate } };
    }

    const categories = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/combined", async (req, res) => {
  try {
    const { month, year } = req.query;
    const params = { month, year };
    const statisticsResponse = await axios.get(
      `http://localhost:5000/api/statistics`,
      { params }
    );
    const barChartResponse = await axios.get(
      `http://localhost:5000/api/bar-chart`,
      { params }
    );
    const pieChartResponse = await axios.get(
      `http://localhost:5000/api/pie-chart`,
      { params }
    );

    const combinedResponse = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.status(200).json(combinedResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
