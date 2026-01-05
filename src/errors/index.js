class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
class ValidationError extends AppError { constructor(msg) { super(msg, 400); } }
class NotFoundError extends AppError { constructor() { super('Not found', 404); } }
class AuthError extends AppError { constructor() { super('Unauthorized', 401); } }

module.exports = { ValidationError, NotFoundError, AuthError };