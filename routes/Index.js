const router = require("express").Router();
const Responder = reqlib("app/services/ResponderService");

// global validate function
// sauce: https://express-validator.github.io/docs/running-imperatively.html#example-standardized-validation-error-response
const { validationResult } = require("express-validator");
global.validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (errors.isEmpty()) {
      return next();
    }

    return Responder.validationError(res, errors.mapped());
  };
};

global.bearerToken = req => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    return null;
  }

  authorization = authorization.split(" ");
  if (authorization.length == 1) {
    return null;
  }
  if (authorization[0] != "Bearer") {
    return null;
  }

  return authorization[1];
};

router.use("/auth", require("./Auth"));
router.use("/users", require("./Users"));

module.exports = router;
