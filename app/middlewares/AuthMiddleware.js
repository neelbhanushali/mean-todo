const Responder = reqlib("app/services/ResponderService");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  jwt.verify(bearerToken(req), process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return Responder.unauthorized(res);
    }

    next();
  });
};
