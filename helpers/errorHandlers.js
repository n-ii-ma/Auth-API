// Invalid ID error
const invalidIdError = (id, next) => {
  const error = new Error(`User with ID of ${id} Not Found!`);
  error.status = 404;
  next(error);
};

module.exports = { invalidIdError };
