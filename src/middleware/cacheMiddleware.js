const cacheGet = (key) => (req, res, next) => {
  // Cache get logic
  next();
};

const cacheInvalidate = (key) => (req, res, next) => {
  // Cache invalidate logic
  next();
};

module.exports = {
  cacheGet,
  cacheInvalidate,
};
