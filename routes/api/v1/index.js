const router = require("express").Router();
const AuthMiddleware = reqlib("app/middlewares/AuthMiddleware");
const AuthController = reqlib("app/controllers/v1/AuthController");

router.use("/auth", require("./Auth"));
router.use("/profile", AuthMiddleware, AuthController.profile);
router.use("/users", AuthMiddleware, require("./Users"));
router.use("/todo", AuthMiddleware, require("./Todo"));

module.exports = router;
