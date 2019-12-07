const router = require("express").Router();
const authController = reqlib("app/controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
