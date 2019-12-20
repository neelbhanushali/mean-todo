const router = require("express").Router();
const Responder = reqlib("app/services/ResponderService");
const AuthMiddleware = reqlib("app/middlewares/AuthMiddleware");

router.use("/auth", require("./Auth"));
router.use("/users", AuthMiddleware, require("./Users"));
router.use("/todo", AuthMiddleware, require("./Todo"));

module.exports = router;
