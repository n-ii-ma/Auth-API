// Pool
const db = require("../db/index");

// Queries
const { selectUsers, selectUser } = require("../db/queries");

// Error Handlers
const { invalidIdError } = require("../helpers/errorHandlers");

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await db.query(selectUsers);
    res.status(200).json(users.rows);
  } catch (err) {
    next(err);
  }
};

// Get one user
const getUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    const getUserById = await db.query(selectUser, [id]);
    if (!getUserById.rows.length) {
      invalidIdError(id, next);
    } else {
      res.status(200).json(getUserById.rows[0]);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUser };
