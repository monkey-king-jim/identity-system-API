const User = require("../model/user");
const {} = require("express-validator");

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  // const userID = uuid.v4();
  const username = req.body.username;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = await User.create({
      // id: userID,
      username: username,
      password: hashedPassword,
      email: email,
    });
    res.status(201).json({ message: "User Created!", user: user });
  } catch (err) {
    console.log(err);
  }
};
