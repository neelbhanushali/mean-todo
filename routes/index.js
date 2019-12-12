const router = require("express").Router();

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

    res.status(422).json({ errors: errors.mapped() });
  };
};

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));

module.exports = router;
