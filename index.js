// mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", {
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
const server = app.listen(3000, function() {
  console.log("server started on port 3000");
});
