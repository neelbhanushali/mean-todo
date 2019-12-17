module.exports = {
  respond(res, data, status = 200) {
    let response = {};
    switch (status) {
      case 200:
        response.data = data;
        response.message = "request completed";
        response.status = true;
        break;

      case 422:
        response.errors = data;
        response.message = "validation error";
        response.status = false;
        break;
    }
    return res.status(status).json(response);
  },

  success(res, data) {
    this.respond(res, data, 200);
  },

  validationError(res, errors) {
    this.respond(res, errors, 422);
  }
};
