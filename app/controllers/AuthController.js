const UserModel = reqlib("app/models/UserModel").UserModel;
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const Responder = reqlib("app/services/ResponderService");

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

    Responder.success(res, user);
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
    check("email")
      .not()
      .isEmpty()
      .withMessage("email daal na re")
      .isEmail()
      .withMessage("email sahi se daal re")
      .custom(async function(value) {
        const user = await UserModel.findOne({ email: value });
        if (!user) {
          return Promise.reject("email nahi mila re");
        }
      })
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

    Responder.success(res, user);

    await user.requestActivation();
  },
  async activationRequest(req, res) {
    const user = await UserModel.findOne({ email: req.body.email });

    Responder.success(res, "email sent");

    await user.requestActivation();
  }
};
