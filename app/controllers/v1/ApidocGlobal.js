/**
 * @apiDefine ValidationErrorResponse
 * @apiError (Error 422) {Boolean} status=false
 * @apiError (Error 422) {message} message="validation error"
 * @apiError (Error 422) {Object} errors error object
 * @apiError (Error 422) {String} errors.field error message
 */

/**
 * @apiDefine SuccessResponse
 * @apiSuccess {Boolean} status=true
 * @apiSuccess {String} message="request completed"
 */
