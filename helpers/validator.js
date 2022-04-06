const { body, validationResult } = require("express-validator");

// Error handling
const customValidationError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Stringify and parse the error and access the first and most specific error message
    const parsedError = JSON.parse(JSON.stringify(errors.array()))[0].msg;

    const error = new Error(parsedError);
    error.status = 400;
    next(error);
  } else {
    next();
  }
};

// Registration validation
const validateRegistration = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name Cannot Be Empty!")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Name Must Be Less than 255 Characters Long!")
    .bail()
    .trim()
    .escape(),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email Cannot Be Empty!")
    .bail()
    .isEmail()
    .withMessage("Email Must Be a Valid Email!")
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage("Email Must Be Between 5 to 255 Characters Long!")
    .bail()
    .normalizeEmail()
    .trim()
    .escape(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password Cannot Be Empty!")
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage("Password Must Be Between 8 to 255 Characters Long!")
    .bail()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,255}$/)
    .withMessage(
      "Password Must Contain at least One Number, One Lowercase, and One Uppercase Character!"
    )
    .bail()
    .trim()
    .escape(),
  customValidationError,
];

// Update validation
const validateUpdate = [
  body("name")
    .optional({ nullable: true })
    .isLength({ max: 255 })
    .withMessage("Name Must Be Less than 255 Characters Long!")
    .bail()
    .trim()
    .escape(),
  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Email Must Be a Valid Email!")
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage("Email Must Be Between 5 to 255 Characters Long!")
    .bail()
    .normalizeEmail()
    .trim()
    .escape(),
  body("password")
    .optional({ nullable: true })
    .isLength({ min: 8, max: 255 })
    .withMessage("Password Must Be Between 8 to 255 Characters Long!")
    .bail()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,255}$/)
    .withMessage(
      "Password Must Contain at least One Number, One Lowercase, and One Uppercase Character!"
    )
    .bail()
    .trim()
    .escape(),
  customValidationError,
];

module.exports = { validateRegistration, validateUpdate };
