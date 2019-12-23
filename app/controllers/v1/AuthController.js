const UserModel = reqlib("app/models/UserModel").UserModel;
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const Responder = reqlib("app/services/ResponderService");
const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports = {
  /**
   * @api {POST} /api/v1/auth/login Login
   * @apiName Login
   * @apiGroup Auth
   * @apiVersion 1.0.0
   * @apiParam {Email} email
   * @apiParam {String} password
   * @apiUse UnauthorizedResponse
   * @apiUse ValidationErrorResponse
   * @apiUse UnauthorizedResponse
   * @apiUse SuccessResponse
   * @apiSuccess {Object} data
   * @apiSuccess {Object} data.token
   * @apiSuccess {Object} data.expires_at
   */
  async login(req, res) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return Responder.unauthorized(res, "invalid credentials");
    }

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
      notBefore: process.env.JWT_NOT_BEFORE
    });

    const expires_at = moment()
      .add(
        process.env.JWT_EXPIRY_MOMENT_MAGNITUDE,
        process.env.JWT_EXPIRY_MOMENT_UNIT
      )
      .toISOString();

    Responder.success(res, { token, expires_at });
  },
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
  /**
   * @api {POST} /api/v1/auth/register Register
   * @apiName Register
   * @apiGroup Auth
   * @apiVersion 1.0.0
   * @apiParam {String} first_name
   * @apiParam {String} middle_name
   * @apiParam {String} last_name
   * @apiParam {Email} email
   * @apiParam {Date} dob
   * @apiParam {String} password
   * @apiParam {String} password_confirmation
   * @apiUse ValidationErrorResponse
   * @apiUse SuccessResponse
   * @apiSuccess {String} data=null
   */
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

    Responder.success(res, null);

    await user.requestActivation();
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
  /**
   * @api {POST} /api/v1/auth/request-activation Request Activation
   * @apiName Request Activation
   * @apiGroup Auth
   * @apiVersion 1.0.0
   * @apiParam {Email} email
   * @apiUse ValidationErrorResponse
   * @apiUse SuccessResponse
   * @apiSuccess {String} data="email sent"
   */
  async activationRequest(req, res) {
    const user = await UserModel.findOne({ email: req.body.email });

    Responder.success(res, "email sent");

    await user.requestActivation();
  },
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
  ]
};
