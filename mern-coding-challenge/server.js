const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const initRoute = require("./routes/init");
const transactionsRoute = 
require("./routes/transactions");

const cors = require("cors");
app.use(cors());


const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: ["GET", "POST"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type"], // Allow these headers
};

app.use(cors(corsOptions));

app.use("/api", transactionsRoute);

app.use("/api", initRoute);

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/mern-coding-challenge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
