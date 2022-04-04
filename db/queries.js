// SELECT all users
const selectUsers = "SELECT * FROM users";

// SELECT a user by id
const selectUserById = "SELECT * FROM users WHERE id = $1";

// INSERT new user
const insertUser =
  "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *";

// UPDATE a user by id
const updateUserById =
  "UPDATE users SET name = COALESCE (NULLIF($1, ''), name), email = COALESCE (NULLIF($2, ''), email), password = COALESCE (NULLIF($3, ''), password) WHERE id = $4 RETURNING *";
// NULLIF returns null if the expressions are equal, otherwise it returns the first expression
// Since COALESCE returns the first non-null value, it'll skip the null value and returns the same value as before
// If the result of NULLIF isn't null, COALESCE will return that new expression

// DELETE a user by id
const deleteUserById = "DELETE FROM users WHERE id = $1";

module.exports = {
  selectUsers,
  selectUserById,
  insertUser,
  updateUserById,
  deleteUserById,
};
