const express = require("express");
const authRouter = express.Router();

// Controller callbacks
const { register } = require("../../controllers/authController");

// Validation
const validateRegistration = require("../../helpers/validator");

// POST new user
authRouter.post("/", validateRegistration, register);

module.exports = authRouter;
