// SELECT all users
const selectUsers = "SELECT * FROM users";

// SELECT a user
const selectUser = "SELECT * FROM users WHERE id = $1";

// INSERT new user
const insertUser =
  "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *";

module.exports = { selectUsers, selectUser, insertUser };
