// Pool
const db = require("../db/index");

// Queries
const { insertUser } = require("../db/queries");

// Error handlers
const { uniqueConstraintError } = require("../helpers/errorHandlers");

// UUID
const { v4: uuidv4 } = require("uuid");

// Passport
const passport = require("passport");

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

// Login
const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    // If no user is found
    if (!user) {
      return res.status(401).json(info);
    }
    // If user is found
    req.login(user, (err) => {
      if (err) {
        return next(err);
      } else {
        return res.status(200).json({
          message: "Login Successful",
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
          },
        });
      }
    });
  })(req, res, next);
};

// Logout
const logout = (req, res, next) => {
  req.logout();
  // Delete session and clear cookie
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout Successful" });
    }
  });
};

module.exports = { register, login, logout };
