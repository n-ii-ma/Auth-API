// Invalid ID error
const invalidIdError = (id, next) => {
  const error = new Error(`User with ID of ${id} Not Found!`);
  error.status = 404;
  next(error);
};

// UNIQUE constraint violation error
const uniqueConstraintError = (next) => {
  const error = new Error("Email Already Exists!");
  error.status = 400;
  next(error);
};

module.exports = { invalidIdError, uniqueConstraintError };
