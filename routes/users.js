const router = require("express").Router();
const userController = reqlib("app/controllers/userController");

router.get("/", userController.list);
router.get("/:userId", userController.show);

module.exports = router;
