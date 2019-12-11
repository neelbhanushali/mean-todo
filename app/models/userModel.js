const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    first_name: String,
    middle_name: {
      type: String,
      default: null
    },
    last_name: String,
    dob: Date,
    email: String,
    password: String
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userSchema, userModel };
