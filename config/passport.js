const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/index");
const bcrypt = require("bcrypt");

// Query
const { selectUserByEmail, selectUserById } = require("../db/queries");

// Local Strategy
const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    try {
      // Checking if user with the given email exists
      const findUser = await db.query(selectUserByEmail, [email]);
      if (!findUser.rows.length) {
        return done(null, false, { message: "User Not Found!" });
      }

      // If user exists
      const user = findUser.rows[0];
      // Compare provided password with the hashed password in db
      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        return done(null, false, { message: "Password Incorrect!" });
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  // Store user id in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Fetch user data from session
  passport.deserializeUser(async (id, done) => {
    try {
      // Fetching user data of the stored id from session
      const findUser = await db.query(selectUserById, [id]);
      const user = findUser.rows[0];
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

module.exports = initialize;
