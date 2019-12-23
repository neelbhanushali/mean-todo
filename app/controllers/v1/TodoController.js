const { check } = require("express-validator");
const TodoModel = reqlib("app/models/TodoModel").TodoModel;
const Responder = reqlib("app/services/ResponderService");
module.exports = {
  list(req, res) {
    res.send(req.url);
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
