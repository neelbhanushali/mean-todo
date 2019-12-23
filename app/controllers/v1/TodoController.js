const { check } = require("express-validator");
const TodoModel = reqlib("app/models/TodoModel").TodoModel;
const Responder = reqlib("app/services/ResponderService");
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
      { is_complete: 1, body: 1 }
    ).sort("-created_at");

    Responder.success(res, todos);
  },
  /**
   * @api {POST} /api/v1/todo Create todo
   * @apiName Create todo
   * @apiGroup Todo
   * @apiVersion 1.0.0
   * @apiParam {String} todo
   * @apiUse AuthHeader
   * @apiUse ValidationErrorResponse
   * @apiUse SuccessResponse
   * @apiSuccess {String} data=null
   */
  async create(req, res) {
    const todo = new TodoModel({
      body: req.body.todo,
      user: res.locals.decoded.sub
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
  ]
};
