const User = require("../model/user");
const { validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/router");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("");
    error.statusCode = 401;
    error.data = errors.array();
    throw error;
  }

  const username = req.body.username;
  const email = req.body.email;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
    res.status(201).json({ message: "User Created!", user: user });
  } catch (err) {
    console.err(err);
    next(err);
  }
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error();
    error.statusCode = 401;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  let registerUser;

  User.findOne({ wehre: { email: email, username: username } })
    .then((user) => {
      if (!user) {
        const error = new Error();
        error.statusCode = 404;
        throw error;
      }

      registerUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error();
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: registerUser.email,
          username: registerUser.username,
        },
        "jamesnodejs",
        { expiresIn: "1w" }
      );

      res
        .status(200)
        .json({ token: token, username: registerUser.username.toString() });
    })
    .catch((err) => {
      next(err);
    });
};
