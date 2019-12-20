const router = require("express").Router();
const TodoController = reqlib("app/controllers/v1/TodoController");

router.get("/", TodoController.list);

module.exports = router;
