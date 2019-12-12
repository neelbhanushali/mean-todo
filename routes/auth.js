const router = require("express").Router();
const AuthController = reqlib("app/controllers/AuthController");

router.post("/login", AuthController.login);
router.post(
  "/register",
  validate(AuthController.registerValidator),
  AuthController.register
);

module.exports = router;
