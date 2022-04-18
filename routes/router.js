const express = require("express");
const { body, check } = require("express-validator/check");
const router = express.Router();

const User = require("../model/user");

const authController = require("../controllers/auth");
const isAuth = require("../_middleware/is-auth");

router.post(
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ],
  authController.signup
);

router.post("/login", [], authController.login);

module.exports = router;
