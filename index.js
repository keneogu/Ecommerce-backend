const express = require("express");
const connectDb = require("./config/connectDb");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require('cookie-parser')
require("dotenv").config();

connectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use(errorHandler);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

app.use("/api/v1", require("./routes/productRoutes"));
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/cartRoutes"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on app ${port}`);
});
