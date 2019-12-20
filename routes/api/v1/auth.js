const router = require("express").Router();
const AuthController = reqlib("app/controllers/v1/AuthController");

router.post(
  "/login",
  validate(AuthController.loginValidator),
  AuthController.login
);
router.post(
  "/register",
  validate(AuthController.registerValidator),
  AuthController.register
);
router.post(
  "/request-activation",
  validate(AuthController.requestActivationValidator),
  AuthController.activationRequest
);

module.exports = router;
