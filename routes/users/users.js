const express = require("express");
const usersRouter = express.Router();

// Controller callbacks
const { getUsers, getUser } = require("../../controllers/usersController");

// GET users
usersRouter.get("/", getUsers);

// GET user
usersRouter.get("/:id", getUser);

module.exports = usersRouter;
