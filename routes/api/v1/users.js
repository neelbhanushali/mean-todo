const router = require("express").Router();
const UserController = reqlib("app/controllers/UserController");

router.get("/", UserController.list);
router.post("/:userId", UserController.show);
router.get("/:userId/token/:token", UserController.activate);

module.exports = router;
