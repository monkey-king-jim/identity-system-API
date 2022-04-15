const express = require("express");
const { body, check } = require("express-validator/check");
const router = express.Router();

const User = require("../model/user");

const authController = require("../controllers/auth");
const isAuth = require("../_middleware/is-auth");

router.post(
  "/sign-up",
  [
    check("username").custom((value) => {
      return User.findOne({ where: { username: value } }).then((user) => {
        if (user) {
          return Promise.reject("Username already exists!");
        }
      });
    }),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((user) => {
          if (user) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ],
  authController.signup
);

router.post("/login", [], authController.login);

router.get("/user-profile", isAuth, (req, res, next) => {
  if (!req.username) {
    const error = new Error();
    error.sta;
  }
});

module.exports = router;
