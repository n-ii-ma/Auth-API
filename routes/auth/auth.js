const express = require("express");
const authRouter = express.Router();

// Passport
const passport = require("passport");

// Controller callbacks
const { register, login, logout } = require("../../controllers/authController");

// Validation
const { validateRegistration } = require("../../helpers/validator");

// Middlewares
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../../middlewares/authMiddlewares");

// Register new user
authRouter.post(
  "/register",
  checkAuthenticated,
  validateRegistration,
  register
);

// Login
authRouter.post("/login", checkAuthenticated, login);

// Logout
authRouter.post("/logout", checkNotAuthenticated, logout);

module.exports = authRouter;
