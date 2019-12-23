const Responder = reqlib("app/services/ResponderService");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = bearerToken(req);
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return Responder.unauthorized(res);
    }

    res.locals.token = token;
    res.locals.decoded = decoded;

    next();
  });
};
