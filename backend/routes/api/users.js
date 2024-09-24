const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

// backend/routes/api/users.js
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  // check("password")
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage("Password must be 6 characters or more."),
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body;
  const existingUser = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username,
        email,
      },
    },
  });

  if (existingUser) {
    const err = {
      message: "User already exists",
      errors: {},
    };
    if (existingUser.email === email && existingUser.username === username) {
      err.errors.email = "User with that email already exists";
      err.errors.username = "User with that username already exists";
    } else if (existingUser.username === username) {
      err.errors.username = "User with that username already exists";
    } else if (existingUser.email === email) {
      err.errors.email = "User with that email already exists";
    }

    return next(err);
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.status(201).json({
    user: safeUser,
  });
});

module.exports = router;
