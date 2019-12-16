const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const moment = require("moment");
const UserTokenModel = reqlib("app/models/UserTokenModel").UserTokenModel;
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");

const UserSchema = new Schema(
  {
    first_name: String,
    middle_name: {
      type: String,
      default: null
    },
    last_name: String,
    dob: Date,
    email: String,
    password: String,
    verified_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.requestActivation = async function() {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const token = new UserTokenModel({
    user: this._id,
    token: Math.random().toString(36),
    type: "activation_token",
    expires_at: moment()
      .add(10, "m")
      .toISOString()
  });

  await token.save();

  let data = this;
  data.url = `http://localhost:6969/users/${this._id}/token/${token.token}`;

  const template = fs.readFileSync(
    appRoot + "/resources/templates/activationEmail.html",
    { encoding: "utf-8" }
  );

  var mailOptions = {
    from: `${process.env.APP_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
    to: `${this.first_name} <${this.email}>`,
    subject: "Activate your account",
    html: ejs.render(template, this)
  };

  transport.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserSchema, UserModel };
