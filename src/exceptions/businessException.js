class BusinessException extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.name = "BusinessException";
  }
}

module.exports = BusinessException;
