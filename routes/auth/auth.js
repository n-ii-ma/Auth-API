const express = require("express");
const authRouter = express.Router();

// Passport
const passport = require("passport");

// Controller callbacks
const { register, login, logout } = require("../../controllers/authController");

// Validation
const { validateRegistration } = require("../../helpers/validator");

// Register new user
authRouter.post("/register", validateRegistration, register);

// Login
authRouter.post("/login", login);

// Logout
authRouter.post("/logout", logout);

module.exports = authRouter;
