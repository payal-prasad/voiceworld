const { ValidationError } = require('../errors');

module.exports = (schema) => (data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) throw new ValidationError(error.details.map(d => d.message).join('; '));
  return value;
};