const express = require("express");
const connectDb = require("./config/connectDb");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

connectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

app.use("/api/v1", require("./routes/productRoutes"));
app.use("/api/v1", require("./routes/userRoutes"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on app ${port}`);
});
