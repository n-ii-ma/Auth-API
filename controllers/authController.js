// Pool
const db = require("../db/index");

// Queries
const { insertUser } = require("../db/queries");

// Error handlers
const { uniqueConstraintError } = require("../helpers/errorHandlers");

// UUID
const { v4: uuidv4 } = require("uuid");

// Bcrypt
const bcrypt = require("bcrypt");

// Create new user
const register = async (req, res, next) => {
  const id = uuidv4();
  const role = "GENERAL";
  const { name, email, password } = req.body;

  try {
    // Hash the input password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(insertUser, [
      id,
      name,
      email,
      hashedPassword,
      role,
    ]);

    res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser.rows[0] });
  } catch (err) {
    // If UNIQUE constraint is violated
    if (err.code == "23505") {
      uniqueConstraintError(next);
    } else {
      next(err);
    }
  }
};

module.exports = { register };
