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
const {
  checkNotAuthenticated,
  checkAdmin,
  checkOwnerOrAdmin,
} = require("../../middlewares/authMiddlewares");

// GET users
usersRouter.get("/", checkNotAuthenticated, checkAdmin, getUsers);

// GET user
usersRouter.get("/:id", checkNotAuthenticated, checkOwnerOrAdmin, getUser);

// UPDATE user
usersRouter.put(
  "/:id",
  checkNotAuthenticated,
  checkOwnerOrAdmin,
  validateUpdate,
  updateUser
);

// DELETE user
usersRouter.delete(
  "/:id",
  checkNotAuthenticated,
  checkOwnerOrAdmin,
  deleteUser
);

module.exports = usersRouter;
