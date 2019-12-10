const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: String,
  middle_name: {
    type: String,
    default: null
  },
  last_name: String,
  dob: Date,
  email: String,
  password: String
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userSchema, userModel };
