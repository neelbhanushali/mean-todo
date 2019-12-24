const router = require("express").Router();
const AuthMiddleware = reqlib("app/middlewares/AuthMiddleware");
const AuthController = reqlib("app/controllers/v1/AuthController");

router.use("/auth", require("./auth"));
router.get("/profile", AuthMiddleware, AuthController.profile);
router.use("/todo", AuthMiddleware, require("./todo"));

module.exports = router;
