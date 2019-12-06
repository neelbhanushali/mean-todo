// dotenv
require("dotenv").config();

// mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongodb");
});

// express
const express = require("express");
const app = express();
const routes = require("./routes");
app.use("/", routes);

// server
const server = app.listen(process.env.SERVER_PORT, function() {
  console.log(`server started on port ${process.env.SERVER_PORT}`);
});
