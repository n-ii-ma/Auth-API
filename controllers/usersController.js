// Pool
const db = require("../db/index");

// Bcrypt
const bcrypt = require("bcrypt");

// Queries
const {
  selectUsers,
  selectUserById,
  updateUserById,
  deleteUserById,
} = require("../db/queries");

// Error Handlers
const {
  invalidIdError,
  uniqueConstraintError,
} = require("../helpers/errorHandlers");

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
    const getUserById = await db.query(selectUserById, [id]);
    if (!getUserById.rows.length) {
      invalidIdError(next);
    } else {
      res.status(200).json(getUserById.rows[0]);
    }
  } catch (err) {
    next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  // Check if password is present in the request body
  // If it is, hash it and set the new hashed password
  // If not, return the same hashed password that was saved in the database
  const updatedPassword = password ? await bcrypt.hash(password, 10) : "";

  try {
    // Check if user with the given id exists
    const findUserById = await db.query(selectUserById, [id]);
    if (!findUserById.rows.length) {
      invalidIdError(next);
    } else {
      const updatedUser = await db.query(updateUserById, [
        name,
        email,
        updatedPassword,
        id,
      ]);

      res.status(200).json({
        message: "User Updated Successfully",
        user: updatedUser.rows[0],
      });
    }
  } catch (err) {
    // If UNIQUE constraint is violated
    if (err.code === "23505") {
      uniqueConstraintError(next);
    }
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  try {
    // Check if user with the given id exists
    const findUserById = await db.query(selectUserById, [id]);
    if (!findUserById.rows.length) {
      invalidIdError(next);
    } else {
      await db.query(deleteUserById, [id]);
      // If the user is Admin, don't log out or delete session after user deletion
      if (req.user.role === "ADMIN") {
        res.status(200).json({ message: "User Deleted Successfully" });
      } else {
        // If the user is not Admin, log out the deleted user and delete its session and clear its cookie
        req.logout();
        req.session.destroy((err) => {
          if (err) {
            next(err);
          } else {
            res.clearCookie("pg.sessionId");
            res.status(200).json({ message: "User Deleted Successfully" });
          }
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
