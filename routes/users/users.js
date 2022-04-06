const express = require("express");
const usersRouter = express.Router();

// Controller callbacks
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../../controllers/usersController");

// Validation
const { validateUpdate } = require("../../helpers/validator");

// Middleware
const { checkNotAuthenticated } = require("../../middlewares/authMiddlewares");

// GET users
usersRouter.get("/", checkNotAuthenticated, getUsers);

// GET user
usersRouter.get("/:id", checkNotAuthenticated, getUser);

// UPDATE user
usersRouter.put("/:id", checkNotAuthenticated, validateUpdate, updateUser);

// DELETE user
usersRouter.delete("/:id", checkNotAuthenticated, deleteUser);

module.exports = usersRouter;
