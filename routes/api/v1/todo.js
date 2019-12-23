const router = require("express").Router();
const TodoController = reqlib("app/controllers/v1/TodoController");

router.get("/", TodoController.list);
router.post(
  "/",
  validate(TodoController.createValidator),
  TodoController.create
);

module.exports = router;
