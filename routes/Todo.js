const router = require("express").Router();
const TodoController = reqlib("app/controllers/TodoController");

router.get("/", TodoController.list);

module.exports = router;
