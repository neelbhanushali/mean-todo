const UserModel = reqlib("app/models/UserModel").UserModel;
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

module.exports = {
  loginValidator: [
    check("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("email daal re")
      .isEmail()
      .withMessage("email sahi daal re")
      .custom(async function(value) {
        const user = await UserModel.findOne({ email: value });
        if (!user) {
          return Promise.reject("pehle register toh karle");
        }
      }),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("password daal re")
  ],
  async login(req, res) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.send("invalid credentials");
    }

    res.json(user);
  },
  registerValidator: [
    check("first_name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("first name daalo"),
    check("last_name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("last name daalo"),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("email toh daal baba")
      .isEmail()
      .withMessage("email sahi daal re")
      .custom(async function(value) {
        const user = await UserModel.findOne({ email: value });
        if (user) {
          return Promise.reject("email already in use");
        }
      })
      .normalizeEmail(),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("password toh daal re")
      .isLength({ min: 6 })
      .withMessage("6 character daal re"),
    check("password_confirmation")
      .trim()
      .not()
      .isEmpty()
      .withMessage("need to confirm password")
      .custom(async function(value, { req }) {
        if (value != req.body.password) {
          return Promise.reject("passwords do not match");
        }
      }),
    check("dob")
      .trim()
      .not()
      .isEmpty()
      .withMessage("dob daal re")
      .isISO8601()
      .withMessage("dob sahi se daal re")
  ],
  requestActivationValidator: [
    check("user")
      .not()
      .isEmpty()
      .withMessage("user id daal na re")
  ],
  async register(req, res) {
    const user = new UserModel({
      first_name: req.body.first_name,
      middle_name: req.body.middle_name ? req.body.middle_name : null,
      last_name: req.body.last_name,
      dob: req.body.dob,
      email: req.body.email,
      password: req.body.password
    });

    await user.save();

    res.send(user);

    await user.requestActivation();
  },
  async activationRequest(req, res) {
    const user = await UserModel.findOne({ _id: req.body.user });

    if (!user) {
      return res.send("user not found");
    }

    res.send("email sent");

    await user.requestActivation();
  }
};
