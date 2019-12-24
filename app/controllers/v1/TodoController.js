const { check } = require("express-validator");
const TodoModel = reqlib("app/models/TodoModel").TodoModel;
const Responder = reqlib("app/services/ResponderService");
const ObjectId = require("mongoose").Types.ObjectId;
module.exports = {
  /**
   * @api {GET} /api/v1/todo Get todo list
   * @apiName Get todo list
   * @apiGroup Todo
   * @apiVersion 1.0.0
   * @apiUse AuthHeader
   * @apiUse ValidationErrorResponse
   * @apiUse SuccessResponse
   */
  async list(req, res) {
    const todos = await TodoModel.find(
      { user: res.locals.decoded.sub },
      { is_complete: 1, body: 1, description: 1, created_at: 1 }
    ).sort("-created_at");

    Responder.success(res, todos);
  },
  /**
   * @api {POST} /api/v1/todo Create todo
   * @apiName Create todo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   * @apiParam {String} todo
   * @apiParam {String} description
   * @apiUse AuthHeader
   * @apiUse ValidationErrorResponse
   * @apiUse SuccessResponse
   * @apiSuccess {String} data=null
   */
  async create(req, res) {
    const todo = new TodoModel({
      body: req.body.todo,
      user: res.locals.decoded.sub,
      description: req.body.description || null
    });

    await todo.save();

    Responder.success(res, null);
  },
  createValidator: [
    check("todo")
      .trim()
      .not()
      .isEmpty()
      .withMessage("todo daal re")
  ],
  /**
   * @api {POST} /api/v1/todo/:todoId Mark todo complete
   * @apiName Mark todo complete
   * @apiGroup Todo
   * @apiVersion 1.0.0
   * @apiUse AuthHeader
   * @apiUse NotFoundResponse
   * @apiUse SuccessResponse
   * @apiUse ValidationErrorResponse
   * @apiSuccess {String} data=null
   */
  async completeTodo(req, res) {
    if (!ObjectId.isValid(req.params.todoId)) {
      return Responder.validationError(res, {
        todoId: "todo id not valid"
      });
    }

    const todo = await TodoModel.findOne({
      user: res.locals.decoded.sub,
      _id: req.params.todoId,
      is_complete: false
    });

    if (!todo) {
      return Responder.notFound(res, "todo not found");
    }

    todo.is_complete = true;
    await todo.save();

    Responder.success(res, null);
  }
};
