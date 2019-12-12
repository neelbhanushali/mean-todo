const router = require("express").Router();
const UserController = reqlib("app/controllers/UserController");

router.get("/", UserController.list);
router.get("/:userId", UserController.show);

module.exports = router;
