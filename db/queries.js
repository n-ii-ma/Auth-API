// SELECT all users
const selectUsers = "SELECT * FROM users";

// SELECT a user
const selectUser = "SELECT * FROM users WHERE id = $1";

module.exports = { selectUsers, selectUser };
