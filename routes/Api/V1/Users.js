const router = require("express").Router();
const UserController = reqlib("app/controllers/UserController");

router.get("/", UserController.list);
router.get("/profile", UserController.getProfile);
router.get("/:userId/token/:token", UserController.activate);

module.exports = router;
