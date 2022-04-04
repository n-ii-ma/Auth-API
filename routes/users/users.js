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

// GET users
usersRouter.get("/", getUsers);

// GET user
usersRouter.get("/:id", getUser);

// UPDATE user
usersRouter.put("/:id", validateUpdate, updateUser);

// DELETE user
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
