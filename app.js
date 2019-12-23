// dotenv
require("dotenv").config();

// mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongodb");
});

// global
require("./global");

// express
const express = require("express");
const app = express();

// body parser
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// routing
app.use("/", reqlib("routes"));
const UserController = reqlib("app/controllers/v1/UserController");
app.get("/activate-user/:userId/token/:token", UserController.activate);

// static
app.use(express.static("public"));

// server
const server = app.listen(process.env.SERVER_PORT, function() {
  console.log(`server started on port ${process.env.SERVER_PORT}`);
  const listEndpoints = require("express-list-endpoints");
  console.log(listEndpoints(app));
});
